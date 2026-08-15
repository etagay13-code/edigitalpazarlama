"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { scroll, range, damp, clamp01 } from "./scroll-store";
import { onTick } from "./ticker";

/* ------------------------------------------------------------------ */
/*  İmza obje: elle tanımlanmış bir eğri boyunca burulan krom şerit.    */
/*  Hazır TorusKnot yerine özel geometri — "three.js demosu" gibi       */
/*  görünmemesi tasarımın yarısı.                                       */
/* ------------------------------------------------------------------ */

const CURVE_POINTS: [number, number, number][] = [
  [0.0, 1.62, 0.0],
  [1.38, 1.02, -0.78],
  [1.88, -0.28, 0.56],
  [0.86, -1.46, -0.36],
  [-0.56, -1.78, 0.72],
  [-1.72, -0.86, -0.56],
  [-1.56, 0.56, 0.66],
  [-0.62, 1.32, -0.46],
];

const CURVE = new THREE.CatmullRomCurve3(
  CURVE_POINTS.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
  true,
  "catmullrom",
  0.5,
);

const TWISTS = 3; // şeridin tur başına burulma sayısı
const HALF_W = 0.19; // şerit yarı genişliği

/** Eğri üzerinde (t, v) noktasının konumu + o noktadaki şerit normali. */
function ribbonPoint(
  t: number,
  v: number,
  frames: ReturnType<THREE.Curve<THREE.Vector3>["computeFrenetFrames"]>,
  segments: number,
  out: { pos: THREE.Vector3; dir: THREE.Vector3 },
) {
  const i = Math.min(segments, Math.max(0, Math.round(t * segments)));
  const p = CURVE.getPointAt(t);
  const n = frames.normals[i];
  const b = frames.binormals[i];
  const a = t * Math.PI * 2 * TWISTS;
  // Şerit ekseni: Frenet çerçevesinde dönen bir vektör → möbius benzeri burgu.
  out.dir.copy(n).multiplyScalar(Math.cos(a)).addScaledVector(b, Math.sin(a));
  out.pos.copy(p).addScaledVector(out.dir, v * HALF_W);
}

function useRibbon(segments: number) {
  return useMemo(() => {
    const frames = CURVE.computeFrenetFrames(segments, true);
    const positions = new Float32Array((segments + 1) * 2 * 3);
    const uvs = new Float32Array((segments + 1) * 2 * 2);
    const tmp = { pos: new THREE.Vector3(), dir: new THREE.Vector3() };

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      for (let s = 0; s < 2; s++) {
        const v = s === 0 ? -1 : 1;
        ribbonPoint(t, v, frames, segments, tmp);
        const o = (i * 2 + s) * 3;
        positions[o] = tmp.pos.x;
        positions[o + 1] = tmp.pos.y;
        positions[o + 2] = tmp.pos.z;
        uvs[(i * 2 + s) * 2] = t;
        uvs[(i * 2 + s) * 2 + 1] = s;
      }
    }

    const index: number[] = [];
    for (let i = 0; i < segments; i++) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geo.setIndex(index);
    geo.computeVertexNormals();
    return { geo, frames };
  }, [segments]);
}

/* ------------------------------------------------------------------ */
/*  Dağılma partikülleri — akt sonunda şerit çözülür.                   */
/* ------------------------------------------------------------------ */

const DISSOLVE_VERT = /* glsl */ `
  attribute vec3 aDir;
  attribute float aRnd;
  uniform float uT;
  uniform float uSize;
  varying float vFade;
  varying float vRnd;
  void main() {
    float d = uT * (1.4 + aRnd * 3.0);
    vec3 p = position + aDir * d;
    p.y += uT * uT * (aRnd - 0.5) * 1.6;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.5 + aRnd) * (60.0 / max(0.001, -mv.z));
    vFade = smoothstep(0.0, 0.12, uT) * (1.0 - smoothstep(0.5, 1.0, uT));
    vRnd = aRnd;
  }
`;

const DISSOLVE_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vFade;
  varying float vRnd;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    float a = smoothstep(0.25, 0.0, d);
    gl_FragColor = vec4(mix(uColorA, uColorB, vRnd), a * vFade);
  }
`;

function useDissolvePoints(count: number, segments: number, accent: string) {
  return useMemo(() => {
    const frames = CURVE.computeFrenetFrames(segments, true);
    const pos = new Float32Array(count * 3);
    const dir = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const tmp = { pos: new THREE.Vector3(), dir: new THREE.Vector3() };

    for (let i = 0; i < count; i++) {
      const t = i / count; // eşit dağılım → şeridin tamamı temsil edilir
      const v = Math.random() * 2 - 1;
      ribbonPoint(t, v, frames, segments, tmp);
      pos.set([tmp.pos.x, tmp.pos.y, tmp.pos.z], i * 3);
      // Dışa doğru: şerit normali + yüzeyden uzaklaşan hafif radyal bileşen.
      const outward = tmp.pos.clone().normalize().multiplyScalar(0.5);
      const d = tmp.dir.clone().multiplyScalar(v).add(outward).normalize();
      dir.set([d.x, d.y, d.z], i * 3);
      rnd[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aDir", new THREE.BufferAttribute(dir, 3));
    geo.setAttribute("aRnd", new THREE.BufferAttribute(rnd, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: DISSOLVE_VERT,
      fragmentShader: DISSOLVE_FRAG,
      uniforms: {
        uT: { value: 0 },
        uSize: { value: 2.6 },
        uColorA: { value: new THREE.Color("#ffffff") },
        uColorB: { value: new THREE.Color(accent) },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geo, mat };
  }, [count, segments, accent]);
}

/* ------------------------------------------------------------------ */

function Sculpture({ accent, quality }: { accent: string; quality: "high" | "low" }) {
  // Segment/partikül sayıları yarıya indirildi — görsel fark yok, maliyet var.
  const segments = quality === "high" ? 480 : 240;
  const { geo } = useRibbon(segments);
  const points = useDissolvePoints(quality === "high" ? 2600 : 1400, segments, accent);

  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);

  // Kamera ve obje hedefleri — her karede damp ile takip edilir (kesme yok).
  const cam = useRef({ z: 8.6, y: 0, rx: 0, ry: 0 });

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    // Akt bittiğinde heykel dağılmış durumda kalıyor. Sayfa sonundaki CTA'da
    // yeniden kurulmuş, uzakta yavaşça dönen haliyle geri gelsin diye zaman
    // çizgisini başa sarıyoruz (geçiş, sahne görünmezken yapılır).
    const a = scroll.cta > 0 ? 0.12 : scroll.act;

    // --- Kamera koreografisi -------------------------------------------
    // Uzak duruş → yaklaş → geri çekil. Objenin İÇİNE girilmez: heykel her
    // karede çerçeve içinde kalmalı, yoksa kompozisyon dağılıyor.
    const zTarget =
      a < 0.3
        ? 9.2 - range(a, 0, 0.3) * 2.7 // 9.2 → 6.5
        : a < 0.78
          ? 6.5 - range(a, 0.3, 0.78) * 0.7 // 6.5 → 5.8
          : 5.8 + range(a, 0.78, 1) * 2.6; // 5.8 → 8.4
    const yTarget = Math.sin(a * Math.PI) * 0.28;

    cam.current.z = damp(cam.current.z, zTarget, 3.5, d);
    cam.current.y = damp(cam.current.y, yTarget, 3.5, d);
    state.camera.position.set(0, cam.current.y, cam.current.z);
    state.camera.lookAt(0, 0, 0);

    if (group.current) {
      const t = state.clock.elapsedTime;

      // Bölüm beat'lerinde metin solda → heykel sağa kayar (geniş ekranda).
      const wide = state.size.width > 980;
      const shiftX = wide ? range(a, 0.16, 0.34) * 1.5 * (1 - range(a, 0.86, 1)) : 0;
      group.current.position.x = damp(group.current.position.x, shiftX, 2.6, d);

      group.current.rotation.y = t * 0.09 + a * Math.PI * 2.2;
      group.current.rotation.x = damp(
        group.current.rotation.x,
        -0.22 + a * 0.55 + scroll.pointerY * 0.1,
        3,
        d,
      );
      group.current.rotation.z = damp(group.current.rotation.z, scroll.pointerX * 0.12, 3, d);

      const s = (1 + Math.sin(a * Math.PI) * 0.1) * (wide ? 1 : 0.82);
      group.current.scale.setScalar(damp(group.current.scale.x, s, 3, d));
    }

    // --- Malzeme: krom, ortada hafif akkor ------------------------------
    // Emissive'i kısık tutuyoruz: yükseldiğinde metal olmaktan çıkıp
    // renkli plastiğe benziyor. Amaç "ısınmış krom", "mor saten" değil.
    if (mat.current) {
      const heat = Math.sin(clamp01(range(a, 0.3, 0.82)) * Math.PI);
      mat.current.emissive.copy(accentColor);
      mat.current.emissiveIntensity = heat * 0.5;
      mat.current.roughness = 0.05 + heat * 0.1;
      const fade = 1 - range(a, 0.84, 0.97);
      mat.current.opacity = fade;
      mat.current.transparent = fade < 1;
    }
    if (mesh.current) mesh.current.visible = range(a, 0.84, 0.99) < 1;

    // --- Dağılma --------------------------------------------------------
    points.mat.uniforms.uT.value = range(a, 0.82, 1);
  });

  return (
    <group ref={group}>
      {/* Physical (clearcoat + iridescence) tam ekranda pahalıydı; krom hissi
          zaten ortam yansımasından geliyor, Standard yeterli ve çok daha ucuz. */}
      <mesh ref={mesh} geometry={geo}>
        <meshStandardMaterial
          ref={mat}
          side={THREE.DoubleSide}
          metalness={1}
          roughness={0.06}
          envMapIntensity={2.1}
        />
      </mesh>
      <points geometry={points.geo} material={points.mat} />
    </group>
  );
}

/** Stüdyo ışığı — HDR indirmeden, sadece lightformer'larla. */
function Studio({ accent }: { accent: string }) {
  return (
    <Environment resolution={128} frames={1}>
      {/* Koyu stüdyo + sert parlak şeritler. Krom hissi tam olarak buradan
          gelir: yansıyacak parlak alan yoksa metal, koyu plastik gibi görünür. */}
      <color attach="background" args={["#0b0b0d"]} />
      {/* Tepe softbox */}
      <Lightformer form="rect" intensity={9} position={[0, 6, 1]} scale={[14, 7, 1]} rotation={[Math.PI / 2, 0, 0]} />
      {/* İmza yansımalar: iki sert dikey şerit (yandan) */}
      <Lightformer form="rect" intensity={16} position={[-6, 0.5, 1]} scale={[0.8, 16, 1]} rotation={[0, Math.PI / 2, 0]} />
      <Lightformer form="rect" intensity={11} position={[6, 1.5, -1]} scale={[0.5, 14, 1]} rotation={[0, -Math.PI / 2, 0]} />
      {/* Önden geniş dolgu — gövdeyi okunur kılar */}
      <Lightformer form="rect" intensity={3.2} position={[0, 0, 7]} scale={[12, 12, 1]} />
      {/* Alttan soğuk dolgu + accent renkli kenar ışığı */}
      <Lightformer form="circle" intensity={2.4} color="#9db4ff" position={[0, -6, 2]} scale={[9, 9, 1]} rotation={[-Math.PI / 2, 0, 0]} />
      <Lightformer form="ring" intensity={5} color={accent} position={[3.5, -2.5, 3]} scale={[4, 4, 1]} />
    </Environment>
  );
}

type Props = { accent?: string };

/**
 * Sabit tam ekran sahne. Karanlık aktta görünür, aydınlık gövde geldiğinde
 * söner (ve GPU'yu boşa yakmamak için frameloop durur), final CTA'da geri gelir.
 */
export function ChromeScene({ accent = "#7C5CFF" }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(true);
  const [quality, setQuality] = useState<"high" | "low">("high");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let gl: WebGLRenderingContext | null = null;
    try {
      const c = document.createElement("canvas");
      gl = (c.getContext("webgl2") ?? c.getContext("webgl")) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }
    if (reduced || !gl) return;

    const weak =
      (navigator.hardwareConcurrency ?? 8) <= 4 || window.matchMedia("(max-width: 768px)").matches;
    setQuality(weak ? "low" : "high");
    setEnabled(true);
  }, []);

  // Görünürlük + opaklık: rAF içinde DOM'a yazılır, React state'e değil.
  useEffect(() => {
    if (!enabled) return;
    let lastActive = true;
    // CTA'nın konumu sayfa uzunluğuna bağlı olmamalı: bölümler eklendikçe
    // sabit bir progress eşiği kayıyor. Doğrudan elemanın kendisini ölçüyoruz.
    const cta = document.getElementById("final-cta");

    return onTick(() => {
      const a = scroll.act;
      // Akt bitişinde sön, sayfa sonundaki CTA'da geri gel.
      const actOpacity = 1 - range(a, 0.92, 1);
      let ctaOpacity = 0;
      if (cta) {
        const rect = cta.getBoundingClientRect();
        const vh = window.innerHeight;
        // Bölüm ekranın altından girerken 0 → ortalandığında tam görünür.
        ctaOpacity = range(vh - rect.top, 0, vh * 0.75) * (1 - range(-rect.bottom, -vh * 0.2, 0)) * 0.5;
      }
      scroll.cta = ctaOpacity > 0 ? 1 : 0;
      const o = Math.max(actOpacity, ctaOpacity);
      if (wrap.current) wrap.current.style.opacity = String(o);
      const shouldRender = o > 0.01;
      if (shouldRender !== lastActive) {
        lastActive = shouldRender;
        setActive(shouldRender);
      }
    });
  }, [enabled]);

  if (!enabled) {
    // Fallback: WebGL yok / hareket azaltma açık → sakin statik gradient.
    return <div aria-hidden className="v2-scene-fallback" />;
  }

  return (
    <div ref={wrap} aria-hidden className="v2-scene">
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={quality === "high" ? [1, 1.5] : [1, 1.15]}
        gl={{ antialias: quality === "high", powerPreference: "high-performance", alpha: true }}
        camera={{ fov: 34, position: [0, 0, 8.6], near: 0.1, far: 60 }}
      >
        <Sculpture accent={accent} quality={quality} />
        <Studio accent={accent} />
      </Canvas>
    </div>
  );
}
