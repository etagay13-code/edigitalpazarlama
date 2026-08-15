"use client";

import { useEffect, useRef } from "react";
import { scroll, range, clamp01 } from "./scroll-store";
import { onTick } from "./ticker";

/**
 * Karanlık sinematik akt: tek bir sticky ekran, üzerinde scroll'a bağlı olarak
 * birbirine karışan "beat"ler. Arkadaki krom heykel (ChromeScene) aynı
 * scroll.act değerini okur — metin ve 3D aynı zaman çizgisinde ilerler.
 *
 * Beat opaklıkları React state'e değil, rAF içinde doğrudan style'a yazılır.
 */

type Beat = {
  /** [görünmeye başla, tam görünür, solmaya başla, kaybol] — akt ilerlemesi 0..1 */
  window: [number, number, number, number];
};

const BEATS: Beat[] = [
  { window: [0, 0, 0.12, 0.19] }, // hero
  { window: [0.22, 0.3, 0.4, 0.46] }, // 01 strateji
  { window: [0.48, 0.55, 0.63, 0.69] }, // 02 kreatif
  { window: [0.7, 0.77, 0.9, 0.97] }, // 03 performans
];

export function ActOne() {
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const specRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);
  const veilC = useRef<HTMLDivElement>(null);
  const veilL = useRef<HTMLDivElement>(null);

  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    // Akt ekrandan çıktığında hiçbir DOM yazması yapma.
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (section.current) io.observe(section.current);

    const off = onTick(() => {
      if (!visible) return;
      const a = scroll.act;

      BEATS.forEach((beat, i) => {
        const [inA, inB, outA, outB] = beat.window;
        const alpha = range(a, inA, inB) * (1 - range(a, outA, outB));
        const node = beatRefs.current[i];
        if (!node) return;
        node.style.opacity = String(alpha);
        // Beat'ler hafifçe yukarı süzülür — sabit durmaz, "kamera" hissi verir.
        const drift = (1 - alpha) * 26;
        node.style.transform = `translate3d(0, ${a > outA ? -drift : drift}px, 0)`;
        node.style.visibility = alpha < 0.01 ? "hidden" : "visible";
      });

      // Perdeler: hero'da merkez, bölümlerde sol taraf koyulaşır.
      if (veilC.current) {
        veilC.current.style.opacity = String(1 - range(a, 0.1, 0.2));
      }
      if (veilL.current) {
        veilL.current.style.opacity = String(range(a, 0.16, 0.26) * (1 - range(a, 0.9, 0.98)));
      }

      // Spec kartları sırayla düşer
      specRefs.current.forEach((node, i) => {
        if (!node) return;
        node.dataset.shown = a > 0.26 + i * 0.05 && a < 0.93 ? "true" : "false";
      });

      if (hintRef.current) {
        hintRef.current.style.opacity = String(clamp01(1 - range(a, 0, 0.08)));
      }

    });

    return () => {
      off();
      io.disconnect();
    };
  }, []);

  const setBeat = (i: number) => (el: HTMLDivElement | null) => {
    beatRefs.current[i] = el;
  };
  const setSpec = (i: number) => (el: HTMLDivElement | null) => {
    specRefs.current[i] = el;
  };

  return (
    // 420vh çok uzundu: aynı anlatı 260vh'de daha tempolu akıyor.
    <section id="act-1" ref={section} className="relative" style={{ height: "220vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={veilC} className="v2-veil v2-veil-center" aria-hidden />
        <div ref={veilL} className="v2-veil v2-veil-left" aria-hidden />

        {/* ---------------------------------------------------- Beat 0: Hero */}
        <div
          ref={setBeat(0)}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="v2-label opacity-55">İstanbul · 360° Dijital Ajans</p>
          <h1 className="v2-display mt-6">
            Dijital büyüme
            <br />
            <span className="v2-italic">mühendisliği</span>
          </h1>
          <p className="v2-body mt-8 max-w-xl opacity-60">
            Reklam, SEO, sosyal medya, mobil uygulama ve SaaS — markanızı
            büyüten her disiplin tek ekipte, tek tabloda.
          </p>
        </div>

        {/* --------------------------------------------- Beat 1-3: Bölümler */}
        {[
          {
            n: "01",
            k: "Strateji",
            h: (
              <>
                Veriyle
                <br />
                <span className="v2-italic">başlar.</span>
              </>
            ),
            p: "Pazar, rakip ve arama niyeti analizi. Hangi kanalın ne kadar getireceğini tahmin değil, model kurarak söylüyoruz.",
          },
          {
            n: "02",
            k: "Kreatif",
            h: (
              <>
                Dikkatle
                <br />
                <span className="v2-italic">devam eder.</span>
              </>
            ),
            p: "Kaydırma hızını kıran kreatif. Her ay yeni varyasyon, her varyasyon için ayrı hipotez ve ayrı ölçüm.",
          },
          {
            n: "03",
            k: "Performans",
            h: (
              <>
                Ölçümle
                <br />
                <span className="v2-italic">bitmez.</span>
              </>
            ),
            p: "Haftalık optimizasyon döngüsü, şeffaf raporlama. Harcanan her liranın nereye gittiğini panelden siz de görüyorsunuz.",
          },
        ].map((c, i) => (
          <div
            key={c.n}
            ref={setBeat(i + 1)}
            className="absolute inset-0 flex items-center px-[clamp(1.25rem,6vw,7rem)]"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <div className="max-w-xl">
              <p className="v2-label opacity-50">
                {c.n} — {c.k}
              </p>
              <h2 className="v2-display-sm mt-5">{c.h}</h2>
              <p className="v2-body mt-6 max-w-md opacity-60">{c.p}</p>
            </div>
          </div>
        ))}

        {/* ------------------------------------------------- Yüzen spec kartları */}
        <div className="pointer-events-none absolute right-[clamp(1.25rem,5vw,4rem)] top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {[
            { k: "Yönetilen reklam bütçesi", v: "₺48M+" },
            { k: "Ortalama ROAS", v: "6.8×" },
            { k: "Organik trafik artışı", v: "+312%" },
            { k: "Teklif süresi", v: "48 saat" },
          ].map((s, i) => (
            <div key={s.k} ref={setSpec(i)} className="v2-spec" data-shown="false">
              <div className="v2-spec-k">{s.k}</div>
              <div className="v2-spec-v">{s.v}</div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------ Scroll ipucu */}
        <div
          ref={hintRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
        >
          <p className="v2-label opacity-45">Kaydır</p>
          <div className="mx-auto mt-3 h-10 w-px bg-white/30" />
        </div>
      </div>
    </section>
  );
}
