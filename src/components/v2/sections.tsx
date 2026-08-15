import Link from "next/link";
import { Reveal, MaskLine } from "./Reveal";

/* ------------------------------------------------------------- Manifesto */

export function Manifesto() {
  return (
    // Üst boşluk sabit çubuğun altında kalacak kadar: aksi halde "YAKLAŞIM"
    // etiketi logoyla üst üste biniyor.
    <section className="v2-light pb-[clamp(4rem,9vh,7rem)] pt-[clamp(6.5rem,11vh,9rem)]">
      <div className="v2-wrap">
        <p className="v2-label opacity-45">Yaklaşım</p>
        <h2 className="v2-display-sm mt-8 max-w-[22ch]">
          <MaskLine>Ajanslar kampanya satar.</MaskLine>
          <MaskLine delay={90}>
            <span className="v2-italic">Biz sistem kurarız.</span>
          </MaskLine>
        </h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            {
              t: "Tek ekip, tüm kanallar",
              d: "Reklam ajansı ayrı, SEO ajansı ayrı, yazılımcı ayrı olduğunda kimse sonuçtan sorumlu olmuyor. Hepsi bizde, sorumlu tek.",
            },
            {
              t: "Kurulan şey sizde kalır",
              d: "Reklam hesabı, analitik kurulumu, içerik altyapısı, kod — hepsi sizin mülkiyetinizde. Ayrılırsak sistem sizinle kalır.",
            },
            {
              t: "Gösterişli değil, ölçülebilir",
              d: "Erişim ve beğeni rapor süsüdür. Biz ciroya giden metrikleri konuşuruz: maliyet, dönüşüm, tekrar satın alma.",
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 110}>
              <div className="v2-rule mb-6" />
              <h3 className="text-lg font-medium tracking-tight">{c.t}</h3>
              <p className="v2-body mt-3 opacity-65">{c.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Hizmet dizini */

const SERVICES = [
  { n: "01", t: "Google & Meta Reklamları", d: "Performans pazarlama, ROAS odaklı", href: "#seo" },
  { n: "02", t: "SEO & İçerik", d: "Teknik SEO, kümelenmiş içerik", href: "#seo" },
  { n: "03", t: "Sosyal Medya Yönetimi", d: "Strateji, üretim, topluluk", href: "#social" },
  { n: "04", t: "Mobil Uygulama", d: "iOS & Android, tasarımdan yayına", href: "#mobile" },
  { n: "05", t: "SaaS & Web Geliştirme", d: "Next.js, ölçeklenebilir mimari", href: "#mobile" },
  { n: "06", t: "360° Dijital Danışmanlık", d: "Tüm kanalların tek yönetimi", href: "#globe" },
];

export function ServicesIndex() {
  return (
    <section className="v2-light pb-[clamp(3.5rem,8vh,6rem)]">
      <div className="v2-wrap">
        <div className="flex items-end justify-between gap-8">
          <h2 className="v2-display-sm max-w-[14ch]">
            Ne <span className="v2-italic">yapıyoruz</span>
          </h2>
          <p className="v2-label hidden opacity-45 sm:block">Altı disiplin · Tek ekip</p>
        </div>

        <div className="mt-14">
          {SERVICES.map((s) => (
            <Link key={s.n} href={s.href} className="v2-index-row" data-cursor="hot">
              <span className="v2-label opacity-45">{s.n}</span>
              <span className="v2-display-sm" style={{ fontSize: "clamp(1.5rem,3.4vw,2.75rem)" }}>
                {s.t}
              </span>
              <span className="v2-label hidden opacity-45 md:inline">{s.d}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Sayılar */

export function Numbers() {
  const items = [
    { v: "₺48M+", k: "Yönetilen reklam bütçesi" },
    { v: "6.8×", k: "Ortalama ROAS" },
    { v: "+312%", k: "Organik trafik artışı" },
    { v: "40+", k: "Aktif marka" },
  ];
  return (
    <section className="v2-light pb-[clamp(4rem,9vh,7rem)]">
      <div className="v2-wrap">
        <div className="v2-rule" />
        <div className="grid grid-cols-2 gap-y-12 py-14 md:grid-cols-4">
          {items.map((i, idx) => (
            <Reveal key={i.k} delay={idx * 90}>
              <div className="v2-display-sm" style={{ fontSize: "clamp(2.25rem,4.5vw,3.5rem)" }}>
                {i.v}
              </div>
              <div className="v2-label mt-3 opacity-45">{i.k}</div>
            </Reveal>
          ))}
        </div>
        <div className="v2-rule" />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Final */

export function FinalCTA() {
  // Arka plan bilerek saydam: sabit krom sahne (ChromeScene) bu bölümde
  // yeniden belirir; opak bir zemin onu tamamen örterdi.
  return (
    <section id="final-cta" className="relative flex min-h-screen items-center">
      <div className="v2-wrap relative z-10 text-center">
        <p className="v2-label opacity-45">Başlayalım</p>
        <h2 className="v2-display mx-auto mt-8 max-w-[16ch]">
          Markanız için <span className="v2-italic">ne mümkün?</span>
        </h2>
        <p className="v2-body mx-auto mt-8 max-w-lg opacity-60">
          48 saat içinde, mevcut kanallarınızın ücretsiz bir analizini ve
          gerçekçi bir büyüme planını size ilettiyoruz.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="/iletisim" className="v2-btn v2-btn-solid" data-cursor="hot">
            Ücretsiz analiz al
          </Link>
          <a href="mailto:info@etruemarketing.com" className="v2-btn" data-cursor="hot">
            info@etruemarketing.com
          </a>
        </div>
      </div>
    </section>
  );
}

export function FooterV2() {
  return (
    <footer className="v2-dark pb-10 pt-16">
      <div className="v2-wrap">
        <div className="v2-rule" />
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 text-xs opacity-45">
          <span>© {new Date().getFullYear()} True EDigital Marketing</span>
          <span className="v2-label">Tasarım prototipi · v2</span>
        </div>
      </div>
    </footer>
  );
}
