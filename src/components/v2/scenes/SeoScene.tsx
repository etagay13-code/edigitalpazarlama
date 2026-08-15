"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, range, damp } from "../scroll-store";
import { gradientTexture, glowTexture } from "./gfx";
import type { StageProgress } from "../ServiceStage";

/**
 * SEO sahnesi — scroll ilerledikçe büyüyen performans grafiği:
 * çizgi soldan sağa çizilir, altındaki degrade alan dolar, zirvelerden
 * yukarı oklar fırlar.
 */

const HEIGHTS = [0.08, 0.19, 0.15, 0.35, 0.31, 0.5, 0.46, 0.68, 0.76, 0.82];
const X0 = -3.5;
const X1 = 3.5;
const BASE_Y = -1.6;
const TOP_Y = 1.9;
const AREA_SAMPLES = 220;
const TUBE_SEGMENTS = 260;
const RADIAL = 10;

const VIOLET = "#7C5CFF";
const CYAN = "#38BDF8";

function chartCurve() {
  const pts = HEIGHTS.map((h, i) => {
    const x = X0 + ((X1 - X0) * i) / (HEIGHTS.length - 1);
    return new THREE.Vector3(x, BASE_Y + h * (TOP_Y - BASE_Y), 0);
  });
  // Hafif yuvarlatılmış köşeler — keskin poligon "veri", tam yumuşak "dekor"
  // görünür; ikisinin arası en okunaklısı.
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.25);
}

/* --------------------------------------------------------- Degrade alan */

const AREA_VERT = /* glsl */ `
  varying float vU;
  varying float vV;
  void main() {
    vU = uv.x;
    vV = uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const AREA_FRAG = /* glsl */ `
  precision mediump float;
  uniform float uProgress;
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vU;
  varying float vV;
  void main() {
    if (vU > uProgress) discard;
    // Çizgiye yaklaştıkça yoğun, tabana inerken sönen dolgu.
    float alpha = pow(vV, 1.35) * 0.62;
    // Çizilen ucun hemen gerisinde hafif bir parlama
    alpha *= 0.75 + 0.25 * smoothstep(uProgress - 0.08, uProgress, vU);
    gl_FragColor = vec4(mix(uA, uB, vU), alpha);
  }
`;

function AreaFill({ curve, progress }: { curve: THREE.CatmullRomCurve3; progress: StageProgress }) {
  const { geo, mat } = useMemo(() => {
    const positions = new Float32Array((AREA_SAMPLES + 1) * 2 * 3);
    const uvs = new Float32Array((AREA_SAMPLES + 1) * 2 * 2);
    for (let i = 0; i <= AREA_SAMPLES; i++) {
      const t = i / AREA_SAMPLES;
      const p = curve.getPointAt(t);
      // alt vertex
      positions.set([p.x, BASE_Y, 0], (i * 2) * 3);
      uvs.set([t, 0], (i * 2) * 2);
      // üst vertex
      positions.set([p.x, p.y, 0], (i * 2 + 1) * 3);
      uvs.set([t, 1], (i * 2 + 1) * 2);
    }
    const index: number[] = [];
    for (let i = 0; i < AREA_SAMPLES; i++) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    g.setIndex(index);

    const m = new THREE.ShaderMaterial({
      vertexShader: AREA_VERT,
      fragmentShader: AREA_FRAG,
      uniforms: {
        uProgress: { value: 0 },
        uA: { value: new THREE.Color(VIOLET) },
        uB: { value: new THREE.Color(CYAN) },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    return { geo: g, mat: m };
  }, [curve]);

  useFrame(() => {
    mat.uniforms.uProgress.value = range(progress.current, 0.12, 0.88);
  });

  return <mesh geometry={geo} material={mat} />;
}

/* ------------------------------------------------------------- Oklar */

function Arrows({ curve, progress }: { curve: THREE.CatmullRomCurve3; progress: StageProgress }) {
  // Zirvelerden fırlayan oklar: her biri belli bir ilerlemede tetiklenir.
  const shots = useMemo(
    () => [0.28, 0.44, 0.58, 0.7, 0.8].map((t) => ({ t, p: curve.getPointAt(t) })),
    [curve],
  );
  const refs = useRef<(THREE.Group | null)[]>([]);
  const tex = useMemo(() => glowTexture(CYAN), []);

  useFrame(() => {
    const p = range(progress.current, 0.12, 0.88);
    shots.forEach((s, i) => {
      const g = refs.current[i];
      if (!g) return;
      const a = clamp01((p - s.t) / 0.16); // 0..1 fırlama animasyonu
      const vis = a > 0 && a < 1;
      g.visible = vis;
      if (!vis) return;
      const ease = 1 - Math.pow(1 - a, 3);
      g.position.set(s.p.x, s.p.y + 0.25 + ease * 2.1, 0.05);
      g.scale.setScalar(0.6 + ease * 0.5);
      const fade = Math.sin(a * Math.PI);
      g.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (m) m.opacity = fade;
      });
    });
  });

  return (
    <>
      {shots.map((s, i) => (
        <group
          key={s.t}
          ref={(el) => {
            refs.current[i] = el;
          }}
          visible={false}
        >
          <mesh position={[0, 0.26, 0]}>
            <coneGeometry args={[0.13, 0.32, 20]} />
            <meshBasicMaterial color={CYAN} transparent depthWrite={false} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.44, 12]} />
            <meshBasicMaterial color={CYAN} transparent depthWrite={false} />
          </mesh>
          <sprite scale={[1.5, 1.5, 1]}>
            <spriteMaterial
              map={tex}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              opacity={0.5}
            />
          </sprite>
        </group>
      ))}
    </>
  );
}

/* --------------------------------------------------------------- Sahne */

export function SeoScene({ progress }: { progress: StageProgress }) {
  const curve = useMemo(() => chartCurve(), []);
  const lineTex = useMemo(() => gradientTexture([VIOLET, "#8B7BFF", CYAN]), []);
  const headTex = useMemo(() => glowTexture("#ffffff"), []);

  const tubeGeo = useMemo(
    () => new THREE.TubeGeometry(curve, TUBE_SEGMENTS, 0.038, RADIAL, false),
    [curve],
  );
  const indexCount = TUBE_SEGMENTS * RADIAL * 6;

  const head = useRef<THREE.Group>(null);
  const bars = useRef<THREE.Group>(null);
  const camRef = useRef({ z: 7.4, y: 0.1 });

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    const raw = progress.current;
    const p = range(raw, 0.12, 0.88);

    // Çizgi soldan sağa çizilir
    tubeGeo.setDrawRange(0, Math.floor(indexCount * p));

    // Ucundaki parlayan nokta
    if (head.current) {
      const pt = curve.getPointAt(Math.max(0.0005, p));
      head.current.position.set(pt.x, pt.y, 0.06);
      head.current.visible = p > 0.01 && p < 0.999;
    }

    // Arkadaki sütunlar sırayla yükselir
    if (bars.current) {
      bars.current.children.forEach((c, i) => {
        const target = clamp01((p - i * 0.075) / 0.2);
        const h = HEIGHTS[i] * (TOP_Y - BASE_Y) * target;
        c.scale.y = damp(c.scale.y, Math.max(0.001, h), 6, d);
        c.position.y = BASE_Y + (h / 2);
      });
    }

    // Kamera: hafif kayış, çok az yaklaşma. Grafik çerçeveyi taşmamalı —
    // taştığı anda "veri" olmaktan çıkıp arkaplan dokusuna dönüşüyor.
    camRef.current.z = damp(camRef.current.z, 8.2 - p * 0.5, 3, d);
    camRef.current.y = damp(camRef.current.y, 0.05 + p * 0.2, 3, d);
    state.camera.position.set(Math.sin(p * Math.PI) * 0.4, camRef.current.y, camRef.current.z);
    state.camera.lookAt(0, 0.15, 0);
  });

  return (
    // Başlık sol-altta durduğu için grafik biraz yukarı-sağa kaydırılır.
    <group position={[0.05, 0.55, 0]} scale={0.86}>
      {/* Izgara çizgileri */}
      {[-0.9, -0.15, 0.6, 1.35].map((y) => (
        <mesh key={y} position={[0, y, -0.4]}>
          <planeGeometry args={[7.6, 0.004]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.09} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[0, BASE_Y, -0.4]}>
        <planeGeometry args={[7.6, 0.006]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} />
      </mesh>

      {/* Sütunlar */}
      <group ref={bars}>
        {HEIGHTS.map((h, i) => {
          const x = X0 + ((X1 - X0) * i) / (HEIGHTS.length - 1);
          return (
            <mesh key={i} position={[x, BASE_Y, -0.25]} scale={[1, 0.001, 1]}>
              <boxGeometry args={[0.16, 1, 0.16]} />
              <meshBasicMaterial color={VIOLET} transparent opacity={0.16} />
            </mesh>
          );
        })}
      </group>

      <AreaFill curve={curve} progress={progress} />

      {/* Çizgi */}
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial map={lineTex} toneMapped={false} />
      </mesh>

      {/* Çizginin ucu */}
      <group ref={head}>
        <mesh>
          <sphereGeometry args={[0.075, 20, 20]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <sprite scale={[1.8, 1.8, 1]}>
          <spriteMaterial
            map={headTex}
            transparent
            opacity={0.75}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      </group>

      <Arrows curve={curve} progress={progress} />
    </group>
  );
}
