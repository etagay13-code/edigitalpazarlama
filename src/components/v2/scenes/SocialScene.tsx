"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { clamp01, range, damp } from "../scroll-store";
import { badgeTexture, glowTexture, type Glyph } from "./gfx";
import type { StageProgress } from "../ServiceStage";

/**
 * Sosyal medya sahnesi — telefonun ekranından dışarı fırlayan etkileşim
 * rozetleri. Marka logosu kullanılmıyor: kalp, oynat, yorum, paylaş gibi
 * jenerik etkileşim sembolleri (telif/marka riski yok, aynı hissi veriyor).
 */

type Badge = {
  glyph: Glyph;
  from: string;
  to: string;
  round: boolean;
  /** çıkış yönü (normalize edilir) */
  dir: [number, number, number];
  size: number;
  delay: number;
};

const BADGES: Badge[] = [
  { glyph: "heart", from: "#FF5B7F", to: "#FF2D55", round: true, dir: [-0.75, 0.55, 0.9], size: 0.62, delay: 0.0 },
  { glyph: "play", from: "#FF4B4B", to: "#C1121F", round: true, dir: [0.9, 0.35, 1.0], size: 0.7, delay: 0.05 },
  { glyph: "camera", from: "#C13584", to: "#F56040", round: true, dir: [0.25, 0.95, 0.75], size: 0.66, delay: 0.1 },
  { glyph: "chat", from: "#5B8DEF", to: "#2F6BFF", round: true, dir: [-1.0, -0.15, 0.8], size: 0.58, delay: 0.14 },
  { glyph: "star", from: "#FFC93C", to: "#FF9F1C", round: true, dir: [0.7, -0.7, 0.85], size: 0.54, delay: 0.19 },
  { glyph: "share", from: "#22D3EE", to: "#0EA5E9", round: true, dir: [-0.45, -0.95, 0.7], size: 0.56, delay: 0.24 },
  { glyph: "note", from: "#2B2B31", to: "#0B0B0E", round: true, dir: [1.05, 0.9, 0.55], size: 0.6, delay: 0.28 },
  { glyph: "hash", from: "#7C5CFF", to: "#5B34D8", round: false, dir: [-0.95, 0.95, 0.55], size: 0.5, delay: 0.33 },
  { glyph: "bolt", from: "#A855F7", to: "#6D28D9", round: true, dir: [0.15, -1.05, 0.6], size: 0.5, delay: 0.37 },
  { glyph: "check", from: "#34D399", to: "#059669", round: true, dir: [-1.1, 0.15, 0.45], size: 0.46, delay: 0.42 },
  { glyph: "heart", from: "#FF7AA2", to: "#FF4778", round: true, dir: [1.1, -0.2, 0.4], size: 0.44, delay: 0.46 },
  { glyph: "play", from: "#F472B6", to: "#DB2777", round: false, dir: [-0.2, 1.1, 0.35], size: 0.42, delay: 0.5 },
  { glyph: "chat", from: "#38BDF8", to: "#0284C7", round: true, dir: [0.55, 1.0, 0.3], size: 0.4, delay: 0.54 },
  { glyph: "star", from: "#FDE68A", to: "#F59E0B", round: true, dir: [-0.7, -0.6, 0.3], size: 0.38, delay: 0.58 },
];

function BadgeMesh({ b, progress, index }: { b: Badge; progress: StageProgress; index: number }) {
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const shadowRef = useRef<THREE.SpriteMaterial>(null);

  const tex = useMemo(() => badgeTexture(b.glyph, b.from, b.to, b.round), [b]);
  // Koyu zeminde siyah gölge sadece çamur yapıyor; rozetin kendi renginde
  // hafif bir hâle çok daha iyi okunuyor.
  const halo = useMemo(() => glowTexture(b.from), [b.from]);
  // Telefon çerçevenin solunda durduğu için çıkış yönleri sağa doğru
  // dengelenir — aksi halde rozetlerin yarısı sol kenardan kaçıyor.
  // Telefon çerçevenin solunda; çıkış yönleri sağa dengelenir. z bileşeni
  // kısılır: kameraya doğru fırlayanlar çok büyüyüp kadraj dışına taşıyordu.
  const dir = useMemo(
    () =>
      new THREE.Vector3(
        Math.max(-0.25, b.dir[0] + 0.55),
        b.dir[1],
        b.dir[2] * 0.45,
      ).normalize(),
    [b],
  );

  useFrame((state) => {
    const p = progress.current;
    const t = state.clock.elapsedTime;
    // Her rozet kendi gecikmesiyle çıkar; sahne sonunda hepsi söner.
    const a = clamp01((p - 0.1 - b.delay * 0.45) / 0.34);
    const out = 1 - range(p, 0.88, 0.99);
    const ease = 1 - Math.pow(1 - a, 2.6);

    if (group.current) {
      const dist = 0.3 + ease * 2.9;
      group.current.position.set(
        dir.x * dist + Math.sin(t * 0.8 + index) * 0.06,
        dir.y * dist + Math.cos(t * 0.7 + index * 1.7) * 0.07,
        dir.z * dist,
      );
      // 0.62: rozetler ekranı kaplamasın — telefon ana özne olarak kalmalı.
      group.current.scale.setScalar(b.size * 0.62 * (0.35 + ease * 0.65));
      // Kameraya bakar ama tam düz değil — hafif eğim 3B hissi verir.
      group.current.rotation.set(
        Math.sin(t * 0.5 + index) * 0.12 - dir.y * 0.18,
        Math.cos(t * 0.45 + index) * 0.12 + dir.x * 0.22,
        Math.sin(t * 0.3 + index) * 0.06,
      );
      group.current.visible = a > 0.001 && out > 0.001;
    }
    const alpha = ease * out;
    if (matRef.current) matRef.current.opacity = alpha;
    if (shadowRef.current) shadowRef.current.opacity = alpha * 0.28;
  });

  return (
    <group ref={group} visible={false}>
      {/* Renkli hâle — rozetleri boşlukta parlar gösterir */}
      <sprite position={[0, 0, -0.05]} scale={[1.9, 1.9, 1]}>
        <spriteMaterial
          ref={shadowRef}
          map={halo}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      <mesh>
        <planeGeometry args={[1, 1]} />
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
  );
}

export function SocialScene({ progress }: { progress: StageProgress }) {
  const phone = useRef<THREE.Group>(null);
  const burst = useRef<THREE.Sprite>(null);
  const glow = useMemo(() => glowTexture("#7C5CFF"), []);
  const camZ = useRef(8.2);

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    const p = progress.current;
    const t = state.clock.elapsedTime;

    if (phone.current) {
      phone.current.rotation.y = damp(phone.current.rotation.y, 0.42 - p * 0.5, 3, d);
      phone.current.rotation.z = damp(phone.current.rotation.z, -0.18 + p * 0.1, 3, d);
      phone.current.rotation.x = Math.sin(t * 0.4) * 0.04;
      phone.current.position.y = Math.sin(t * 0.5) * 0.07;
    }

    // Ekrandan taşan ışık: rozetler çıktıkça güçlenir
    if (burst.current) {
      const m = burst.current.material as THREE.SpriteMaterial;
      m.opacity = range(p, 0.1, 0.4) * 0.5 * (1 - range(p, 0.85, 1));
      const s = 2.4 + range(p, 0.1, 0.6) * 2;
      burst.current.scale.set(s, s, 1);
    }

    camZ.current = damp(camZ.current, 8.6 - range(p, 0, 0.9) * 1.2, 3, d);
    state.camera.position.set(0.2, 0.35, camZ.current);
    state.camera.lookAt(0, 0.35, 0);
  });

  return (
    // Telefon ve rozetler AYNI orijini paylaşır: rozetler ekrandan çıkıyormuş
    // gibi görünmesinin tek yolu bu (önce sahne merkezinden fırlıyorlardı).
    <group position={[-1.1, 0.75, 0]}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 4, 6]} intensity={2} />
      <directionalLight position={[-4, 1, 2]} intensity={0.9} color="#38BDF8" />

      <sprite ref={burst} scale={[2.4, 2.4, 1]}>
        <spriteMaterial
          map={glow}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <group ref={phone}>
        <RoundedBox args={[1.4, 2.85, 0.16]} radius={0.15} smoothness={5}>
          <meshStandardMaterial color="#1b1b21" metalness={0.8} roughness={0.3} />
        </RoundedBox>
        <mesh position={[0, 0, 0.085]}>
          <planeGeometry args={[1.26, 2.72]} />
          <meshBasicMaterial color="#0f1424" />
        </mesh>
        <mesh position={[0, 0, 0.087]}>
          <planeGeometry args={[1.26, 2.72]} />
          <meshBasicMaterial color="#2563eb" transparent opacity={0.35} depthWrite={false} />
        </mesh>
      </group>

      {BADGES.map((b, i) => (
        <BadgeMesh key={`${b.glyph}-${i}`} b={b} progress={progress} index={i} />
      ))}
    </group>
  );
}
