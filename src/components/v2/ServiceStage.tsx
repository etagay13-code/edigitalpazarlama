"use client";

import { useEffect, useRef, useState, type ReactNode, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clamp01, range } from "./scroll-store";
import { onTick } from "./ticker";

export type StageProgress = MutableRefObject<number>;

/**
 * Dar ekranlarda sahneyi küçültür. Sahneler geniş ekran kompozisyonuna göre
 * kuruldu; portre viewport'ta kamera aynı kalırsa objeler çerçeveyi taşıyor.
 * Tek yerden ölçekleyerek dört sahnenin hepsini birden çözüyoruz.
 */
function ResponsiveFit({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const s = THREE.MathUtils.clamp(state.size.width / 1250, 0.44, 1);
    ref.current.scale.setScalar(s);
  });
  return <group ref={ref}>{children}</group>;
}

/**
 * Hizmet sahnesi çerçevesi.
 *
 * 300vh'lik bir bölüm; içinde sticky bir ekran. Bölümün kendi scroll ilerlemesi
 * (0..1) bir ref'e yazılır ve hem 3D sahne hem üstteki metin katmanı bunu okur.
 *
 * Performans: Canvas yalnızca bölüm viewport'a yaklaştığında MOUNT edilir ve
 * ekrandan çıkınca frameloop durur — dört ayrı WebGL sahnesi aynı anda
 * GPU yakmasın diye.
 */
export function ServiceStage({
  id,
  index,
  label,
  title,
  description,
  specs,
  scene,
  overlay,
  tone = "dark",
}: {
  id: string;
  index: string;
  label: string;
  title: ReactNode;
  description: string;
  specs: { k: string; v: string }[];
  /** progress ref'ini alan sahne fabrikası */
  scene: (progress: StageProgress) => ReactNode;
  /** 3D'nin üstünde, ilerlemeye bağlı DOM katmanı (ör. dev "360°" yazısı) */
  overlay?: (progress: StageProgress) => ReactNode;
  tone?: "dark" | "light";
}) {
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const specRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = section.current;
    if (!el) return;

    // İKİ ayrı eşik:
    //  - mount: yaklaşınca WebGL bağlamını hazırla (ilk karede takılmasın)
    //  - active: SADECE gerçekten ekrandayken render et
    // Tek eşik kullanınca yakındaki 3 sahne aynı anda çiziliyordu; FPS'i
    // yere seren asıl sebep buydu.
    // Bir tam ekran önceden mount et: doku/geometri kurulumundaki takılma
    // sahne henüz görünmezken yaşansın, kullanıcı ona bakarken değil.
    const ioMount = new IntersectionObserver(
      ([e]) => e.isIntersecting && setMounted(true),
      { rootMargin: "100% 0px 100% 0px" },
    );
    const ioActive = new IntersectionObserver(([e]) => setActive(e.isIntersecting));
    ioMount.observe(el);
    ioActive.observe(el);

    let onScreen = false;
    const ioWork = new IntersectionObserver(([e]) => (onScreen = e.isIntersecting));
    ioWork.observe(el);

    const off = onTick(() => {
      if (!onScreen) return;
      const rect = el.getBoundingClientRect();
      const span = Math.max(1, rect.height - window.innerHeight);
      progress.current = clamp01(-rect.top / span);

      const p = progress.current;
      if (titleRef.current) {
        const alpha = range(p, 0.05, 0.16) * (1 - range(p, 0.86, 0.97));
        titleRef.current.style.opacity = String(alpha);
        titleRef.current.style.transform = `translate3d(0, ${(1 - alpha) * 18}px, 0)`;
      }
      specRefs.current.forEach((node, i) => {
        if (!node) return;
        node.dataset.shown = p > 0.3 + i * 0.09 && p < 0.92 ? "true" : "false";
      });

    });

    return () => {
      ioMount.disconnect();
      ioActive.disconnect();
      ioWork.disconnect();
      off();
    };
  }, []);

  return (
    <section
      id={id}
      ref={section}
      className={`v2-stage ${tone === "dark" ? "v2-dark" : "v2-light"}`}
    >
      <div className="v2-stage-sticky">
        <div className="v2-stage-canvas">
          {mounted && (
            <Canvas
              frameloop={active ? "always" : "never"}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              camera={{ fov: 38, position: [0, 0, 7], near: 0.1, far: 60 }}
            >
              <ResponsiveFit>{scene(progress)}</ResponsiveFit>
            </Canvas>
          )}
        </div>

        {/* Sıra önemli: perde 3D'nin üstünde, ama overlay ve metnin altında. */}
        <div className="v2-stage-veil" aria-hidden />

        {overlay?.(progress)}

        <div className="v2-stage-ui">
          <div className="flex items-start justify-between">
            <p className="v2-label opacity-50">
              {index} — {label}
            </p>
            <div className="hidden flex-col items-end gap-3 md:flex">
              {specs.map((s, i) => (
                <div
                  key={s.k}
                  ref={(el) => {
                    specRefs.current[i] = el;
                  }}
                  className="v2-spec"
                  data-shown="false"
                >
                  <div className="v2-spec-k">{s.k}</div>
                  <div className="v2-spec-v">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div ref={titleRef} style={{ opacity: 0 }} className="max-w-xl">
            <h2 className="v2-display-sm">{title}</h2>
            <p className="v2-body mt-5 max-w-md opacity-65">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
