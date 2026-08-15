"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { range, damp, clamp01 } from "../scroll-store";
import { glowTexture } from "./gfx";
import { onTick } from "../ticker";
import type { StageProgress } from "../ServiceStage";

/**
 * 360° sahnesi — nokta bulutundan bir dünya, üzerinde kanaldan kanala akan
 * ışık yayları. Scroll ilerledikçe kamera içine doğru yaklaşır; DOM'daki
 * dev "360°" küçülüp yerini kanal başlıklarına bırakır (GlobeCaption).
 */

const R = 2.15;
const DOTS = 1600;
const ACCENT = "#7C5CFF";
const CYAN = "#38BDF8";

function fibonacciSphere(n: number, radius: number) {
  const pos = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = golden * i;
    pos.set([Math.cos(th) * r * radius, y * radius, Math.sin(th) * r * radius], i * 3);
  }
  return pos;
}

/** İki yüzey noktası arasında, küreden yükselen yay. */
function arcCurve(a: THREE.Vector3, b: THREE.Vector3) {
  const mid = a.clone().add(b).normalize().multiplyScalar(R * (1.18 + a.distanceTo(b) * 0.09));
  return new THREE.QuadraticBezierCurve3(a, mid, b);
}

export function GlobeScene({ progress }: { progress: StageProgress }) {
  const world = useRef<THREE.Group>(null);
  const camRef = useRef({ z: 8.4 });

  const dots = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(fibonacciSphere(DOTS, R), 3));
    return g;
  }, []);

  const dotMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.022,
        color: new THREE.Color("#cfd3ff"),
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  // Sabit "kanal" düğümleri — her sahne yüklemesinde aynı yerde dursunlar.
  const nodes = useMemo(() => {
    const seeds: [number, number][] = [
      [41, 29], [51, 0], [40, -74], [35, 139], [1, 103], [-23, -46],
      [25, 55], [55, 37], [-33, 151], [37, -122], [48, 2], [30, 31],
    ];
    return seeds.map(([lat, lon]) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -R * Math.sin(phi) * Math.cos(theta),
        R * Math.cos(phi),
        R * Math.sin(phi) * Math.sin(theta),
      );
    });
  }, []);

  const arcs = useMemo(() => {
    const pairs: [number, number][] = [
      [0, 2], [0, 3], [0, 6], [1, 7], [2, 9], [4, 8], [5, 2], [10, 0], [11, 3], [6, 1],
    ];
    return pairs.map(([i, j], k) => ({
      curve: arcCurve(nodes[i], nodes[j]),
      phase: k / pairs.length,
    }));
  }, [nodes]);

  const travellers = useRef<(THREE.Sprite | null)[]>([]);
  const glow = useMemo(() => glowTexture(CYAN), []);
  const nodeGlow = useMemo(() => glowTexture("#ffffff"), []);

  useEffect(() => () => dots.dispose(), [dots]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    const p = progress.current;
    const t = state.clock.elapsedTime;

    if (world.current) {
      world.current.rotation.y = t * 0.075 + p * Math.PI * 0.9;
      world.current.rotation.x = damp(world.current.rotation.x, -0.12 + p * 0.2, 3, d);
    }

    // Yaklaşma: uzaktan bakış → küreye giriş eşiği
    camRef.current.z = damp(camRef.current.z, 8.4 - range(p, 0.05, 0.95) * 4.6, 3, d);
    state.camera.position.set(0, 0, camRef.current.z);
    state.camera.lookAt(0, 0, 0);

    // Yay üzerinde koşan ışıklar
    arcs.forEach((a, i) => {
      const s = travellers.current[i];
      if (!s) return;
      const u = (t * 0.18 + a.phase) % 1;
      const pt = a.curve.getPoint(u);
      s.position.copy(pt);
      const fade = Math.sin(u * Math.PI);
      (s.material as THREE.SpriteMaterial).opacity = fade * 0.9 * clamp01(range(p, 0.08, 0.25));
    });

    dotMat.opacity = 0.75 * (1 - range(p, 0.82, 1) * 0.5);
  });

  return (
    <group ref={world}>
      <points geometry={dots} material={dotMat} />

      {/* Küre kafesi: bir ekvator + dikey meridyenler. Rastgele eğimli halkalar
          küreyi değil, kesişen düz çizgileri okutuyordu. */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[R, 0.0035, 8, 240]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {[0, Math.PI / 3, (2 * Math.PI) / 3].map((ry, i) => (
        <mesh key={i} rotation={[0, ry, 0]}>
          <torusGeometry args={[R, 0.003, 8, 240]} />
          <meshBasicMaterial color={ACCENT} transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}

      {/* Yaylar */}
      {arcs.map((a, i) => (
        <mesh key={i}>
          <tubeGeometry args={[a.curve, 64, 0.008, 6, false]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.32} depthWrite={false} />
        </mesh>
      ))}

      {/* Yaylarda koşan ışıklar */}
      {arcs.map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            travellers.current[i] = el;
          }}
          scale={[0.42, 0.42, 1]}
        >
          <spriteMaterial
            map={glow}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}

      {/* Düğüm noktaları */}
      {nodes.map((n, i) => (
        <sprite key={i} position={n} scale={[0.3, 0.3, 1]}>
          <spriteMaterial
            map={nodeGlow}
            transparent
            opacity={0.55}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  DOM katmanı: dev "360°" yazısı ve kanal başlıkları                 */
/* ------------------------------------------------------------------ */

export function GlobeCaption({ progress }: { progress: StageProgress }) {
  const big = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let prev = -1;
    return onTick(() => {
      const p = progress.current;
      // Sahne durduğunda DOM'a yazma.
      if (Math.abs(p - prev) < 0.0004) return;
      prev = p;

      if (big.current) {
        // Yaklaştıkça büyüyüp saydamlaşır — kameranın içinden geçiyormuş gibi.
        const scale = 1 + range(p, 0, 0.55) * 1.5;
        const alpha = range(p, 0.02, 0.12) * (1 - range(p, 0.32, 0.52));
        big.current.style.transform = `translate3d(-50%,-50%,0) scale(${scale})`;
        big.current.style.opacity = String(alpha);
      }

      items.current.forEach((node, i) => {
        if (!node) return;
        const start = 0.46 + i * 0.07;
        const alpha = range(p, start, start + 0.09) * (1 - range(p, 0.9, 0.98));
        node.style.opacity = String(alpha);
        node.style.transform = `translate3d(0, ${(1 - alpha) * 16}px, 0)`;
      });

    });
  }, [progress]);

  const channels = [
    { k: "Arama", v: "Google Ads · SEO" },
    { k: "Sosyal", v: "Meta · TikTok · LinkedIn" },
    { k: "Ürün", v: "Web · Mobil · SaaS" },
    { k: "Ölçüm", v: "GA4 · Looker · CRM" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[2]">
      <div
        ref={big}
        className="v2-display absolute left-1/2 top-1/2"
        style={{ opacity: 0, transform: "translate3d(-50%,-50%,0)", lineHeight: 1 }}
      >
        360°
      </div>

      <div className="absolute bottom-[18%] left-1/2 grid w-full max-w-4xl -translate-x-1/2 grid-cols-2 gap-x-8 gap-y-6 px-8 md:grid-cols-4">
        {channels.map((c, i) => (
          <div
            key={c.k}
            ref={(el) => {
              items.current[i] = el;
            }}
            style={{ opacity: 0 }}
          >
            <div className="v2-rule mb-3" />
            <div className="text-sm font-medium tracking-tight">{c.k}</div>
            <div className="v2-label mt-1.5 opacity-45" style={{ letterSpacing: "0.12em" }}>
              {c.v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
