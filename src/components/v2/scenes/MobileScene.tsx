"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { clamp01, range, damp } from "../scroll-store";
import { uiPanelTexture, type PanelVariant } from "./gfx";
import type { StageProgress } from "../ServiceStage";

/**
 * Mobil uygulama sahnesi — başta sadece boş bir telefon var; scroll ilerledikçe
 * etrafında UI panelleri tek tek beliriyor, telefona ince çizgilerle bağlanıyor.
 */

type PanelDef = {
  variant: PanelVariant;
  from: string;
  to: string;
  pos: [number, number, number];
  rot: [number, number, number];
  scale: number;
  at: number; // hangi ilerlemede belirsin
};

// Konumlar telefona yakın tutulur: paneller çerçeveyi taşarsa "uçuşan UI"
// hissi kaybolup ekranı kaplayan renk lekelerine dönüşüyor.
const PANELS: PanelDef[] = [
  { variant: "player", from: "#FF7A45", to: "#FF3D71", pos: [-1.85, 0.72, 0.7], rot: [0.05, 0.42, 0.03], scale: 0.62, at: 0.2 },
  { variant: "search", from: "#F5F7FA", to: "#DCE3EE", pos: [1.35, 1.32, 0.15], rot: [0.02, -0.3, -0.02], scale: 0.5, at: 0.3 },
  { variant: "profile", from: "#B14BFF", to: "#7C5CFF", pos: [1.95, 0.15, 0.55], rot: [0.04, -0.44, 0.02], scale: 0.58, at: 0.4 },
  { variant: "list", from: "#FF4D9D", to: "#FF7A45", pos: [1.6, -1.15, 0.9], rot: [-0.05, -0.4, -0.03], scale: 0.55, at: 0.5 },
  { variant: "chart", from: "#22D3EE", to: "#3B82F6", pos: [-1.75, -1.05, 0.5], rot: [-0.04, 0.4, 0.02], scale: 0.54, at: 0.6 },
];

function Panel({ def, progress }: { def: PanelDef; progress: StageProgress }) {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => uiPanelTexture(def.variant, def.from, def.to), [def]);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const lineRef = useRef<THREE.Mesh>(null);

  // Telefon kenarından panele giden bağlantı çizgisi
  const link = useMemo(() => {
    const from = new THREE.Vector3(def.pos[0] > 0 ? 0.62 : -0.62, def.pos[1] * 0.35, 0.1);
    const to = new THREE.Vector3(...def.pos);
    const mid = from.clone().add(to).multiplyScalar(0.5);
    return { from, to, mid, len: from.distanceTo(to) };
  }, [def]);

  useFrame((state) => {
    const p = progress.current;
    const a = clamp01((p - def.at) / 0.14);
    const out = 1 - range(p, 0.9, 0.99);
    const ease = 1 - Math.pow(1 - a, 3);
    const t = state.clock.elapsedTime;

    if (group.current) {
      group.current.visible = a > 0.001 && out > 0.001;
      const s = def.scale * (0.55 + ease * 0.45);
      group.current.scale.setScalar(s);
      // Belirirken telefondan dışa doğru açılır + hafifçe salınır
      group.current.position.set(
        def.pos[0] * (0.45 + ease * 0.55),
        def.pos[1] * (0.45 + ease * 0.55) + Math.sin(t * 0.7 + def.at * 9) * 0.07,
        def.pos[2] * ease,
      );
    }
    if (matRef.current) matRef.current.opacity = ease * out;
    if (lineRef.current) {
      const m = lineRef.current.material as THREE.MeshBasicMaterial;
      m.opacity = ease * out * 0.35;
      lineRef.current.scale.x = ease;
    }
  });

  return (
    <>
      <mesh
        ref={lineRef}
        position={link.mid}
        rotation={[0, 0, Math.atan2(link.to.y - link.from.y, link.to.x - link.from.x)]}
      >
        <planeGeometry args={[link.len, 0.008]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
      </mesh>

      <group ref={group} rotation={def.rot} visible={false}>
        <mesh>
          <planeGeometry args={[1.6, 1.2]} />
          <meshBasicMaterial
            ref={matRef}
            map={tex}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
}

export function MobileScene({ progress }: { progress: StageProgress }) {
  const phone = useRef<THREE.Group>(null);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null);
  const camZ = useRef(7.4);

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    const p = progress.current;
    const t = state.clock.elapsedTime;

    if (phone.current) {
      phone.current.rotation.y = damp(
        phone.current.rotation.y,
        -0.35 + p * 0.7 + Math.sin(t * 0.4) * 0.05,
        3,
        d,
      );
      phone.current.rotation.x = damp(phone.current.rotation.x, 0.08 - p * 0.12, 3, d);
      phone.current.position.y = Math.sin(t * 0.55) * 0.06;
    }

    // Ekran, paneller belirdikçe uyanıyor
    if (screenMat.current) screenMat.current.opacity = 0.25 + range(p, 0.12, 0.35) * 0.55;

    camZ.current = damp(camZ.current, 7.5 - range(p, 0, 0.9) * 0.6, 3, d);
    state.camera.position.set(Math.sin(p * Math.PI * 0.8) * 0.45, 0.15, camZ.current);
    state.camera.lookAt(0, 0.35, 0);
  });

  return (
    <group position={[0.3, 0.5, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 6]} intensity={2.2} />
      <directionalLight position={[-4, -2, 3]} intensity={0.8} color="#7C5CFF" />

      <group ref={phone}>
        {/* Gövde */}
        <RoundedBox args={[1.28, 2.62, 0.15]} radius={0.14} smoothness={5}>
          <meshStandardMaterial color="#17171c" metalness={0.85} roughness={0.28} />
        </RoundedBox>
        {/* Ekran */}
        <mesh position={[0, 0, 0.079]}>
          <planeGeometry args={[1.16, 2.5]} />
          <meshBasicMaterial ref={screenMat} color="#0d0d12" transparent opacity={0.25} />
        </mesh>
        {/* Ekrandaki accent parıltısı — ekranın tamamına yayılır */}
        <mesh position={[0, 0, 0.081]}>
          <planeGeometry args={[1.16, 2.5]} />
          <meshBasicMaterial color="#7C5CFF" transparent opacity={0.22} depthWrite={false} />
        </mesh>
        {/* Ada/çentik */}
        <mesh position={[0, 1.08, 0.083]}>
          <planeGeometry args={[0.34, 0.1]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {PANELS.map((def) => (
        <Panel key={def.variant} def={def} progress={progress} />
      ))}
    </group>
  );
}
