import type { Metadata } from "next";
import Link from "next/link";
import {
  Layers,
  Wrench,
  Zap,
  Crosshair,
  Lock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { ServicesGrid } from "@/components/ServicesGrid";
import { Reveal, Stagger } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { GradientBlobs } from "@/components/GradientBlob";
import { industries, techStack } from "@/lib/industries";
import { brand } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Hizmetler",
  description:
    "Reklam yönetimi, SEO, sosyal medya, mobil uygulama, SaaS geliştirme, web tasarım ve içerik stratejisi — markanızı büyütecek tüm hizmetler.",
};

const synergyBenefits = [
  {
    icon: Layers,
    title: "Tek brief, tüm kanallar",
    desc: "Reklam ekibi, SEO ekibi ve sosyal medya ekibi aynı strateji belgesi üzerinden çalışır. Brief ezberi yok.",
  },
  {
    icon: Zap,
    title: "Hızlı iterasyon",
    desc: "Bir kanalda öğrendiğimiz bir içgörü, 48 saat içinde diğer kanallara taşınır. Bilgi silosu yok.",
  },
  {
    icon: Crosshair,
    title: "Attribution netliği",
    desc: "Channel-level değil customer-level görüyoruz. Hangi kanalın hangi temas noktasını kazandırdığı net.",
  },
  {
    icon: Lock,
    title: "Marka tutarlılığı",
    desc: "Reklamdaki ses tonu, SEO içeriğindeki dille, sosyal medyadaki anlatımla birebir aynı.",
  },
];

const pricingModels = [
  {
    title: "Retainer Model",
    range: "₺45.000 — ₺120.000 / ay",
    desc: "Süreklilik isteyen hizmetler (reklam yönetimi, SEO, sosyal medya). Minimum 3 ay.",
    fits: "E-ticaret, SaaS, hizmet markaları",
  },
  {
    title: "Proje Bazlı",
    range: "₺80.000 — ₺850.000",
    desc: "Sabit kapsam-sabit fiyat. Web sitesi, mobil uygulama, MVP geliştirme.",
    fits: "Startup'lar, kurumsal lansmanlar",
  },
  {
    title: "Performans + Sabit",
    range: "Bütçenin %8-12'si + sabit yönetim",
    desc: "Reklam yönetiminde popüler. Bütçeniz büyüdükçe ölçek avantajı sizin lehinize.",
    fits: "Aylık reklam bütçesi ₺250K+",
  },
];

const serviceFaqs = [
  {
    q: "Hizmetleri tek tek alabilir miyim, yoksa paket mi zorunlu?",
    a: "Hayır, paket zorunluluğu yok. Tek bir hizmetle başlayıp gerek görüldükçe diğer alanları açabilirsiniz. Çoğu müşterimiz reklam yönetimi veya SEO ile başlar; 6 ay içinde 2-3 hizmete genişler.",
  },
  {
    q: "Reklam bütçesi minimum ne olmalı?",
    a: "Meta Ads'te aylık ₺50.000, Google Ads'te ₺75.000 altında gerçek anlamda test yapmak zor. Bu rakamların altındaki bütçelerde önce organik kanallarla (SEO + sosyal medya) başlamayı öneriyoruz.",
  },
  {
    q: "Kreatif üretim dahil mi yoksa ek ücret mi?",
    a: "Retainer modelimizde aylık belirli sayıda kreatif dahildir (reklam görseli, video, post). Ek kreatif ihtiyaçları net fiyatlandırma ile çözülür — sürpriz fatura yok.",
  },
  {
    q: "Beğenmezsem ne olur?",
    a: "İlk 90 gün ölçülebilir iyileşme garantisi. Olmazsa kontrat sonlanır, son ay ücretini almıyoruz. Bunu sözleşmeye yazıyoruz.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader
            eyebrow="Hizmetler"
            title="Markanız için bütünsel dijital büyüme"
            description="Her hizmeti bağımsız bir ürün gibi düşünüyoruz; ama gücü bir araya geldiklerinde ortaya çıkıyor. Aşağıdaki hizmetlerin tümünü tek bir hesap planı, tek bir iletişim noktası altında alabilirsiniz."
          />
        </div>
      </section>

      {/* Hizmet Grid — her kart kendi detay sayfasına */}
      <section className="section pt-4">
        <div className="container-x">
          <div className="mb-8 flex items-center justify-between">
            <p className="text-sm text-white/55">
              Detayları görmek için bir hizmete tıkla
            </p>
            <Link
              href="/iletisim"
              className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:inline-flex sm:items-center sm:gap-1"
            >
              Hangisi sana uygun?
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <ServicesGrid />
        </div>
      </section>

      {/* Sentez bölümü */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Hizmetlerin Sentezi"
            title="Ayrı ajanslar yerine tek sinir sistemi"
            description="Bir ajans reklam, bir başkası SEO, başka biri sosyal medya — tipik kurguda her ajans diğerinin işine değil sadece kendi performansına bakar. Biz tek bir takım olduğumuz için kanallar arası kayıp sıfıra iniyor."
          />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {synergyBenefits.map((b) => {
              const Icon = b.icon;
              return (
                <Reveal key={b.title}>
                  <div className="card h-full">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 shadow-glow">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="mt-5 font-display text-lg font-semibold">
                      {b.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">{b.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Sektörler */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Sektörler"
            title="Çalıştığımız sektörler"
            description="Her sektörün kendi dinamikleri, regülasyonları ve müşteri davranışları vardır. Geniş portföyümüz sayesinde sektörel öğrenmeleri yeni projelere hızlıca taşıyoruz."
          />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((ind) => (
              <Reveal key={ind.name}>
                <div className="card h-full">
                  <h4 className="font-display text-lg font-semibold">{ind.name}</h4>
                  <p className="mt-3 text-sm text-white/60">{ind.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {ind.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/55"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Teknoloji & Araçlar */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Teknoloji & Araçlar"
            title="Birlikte çalıştığımız stack"
            description="Sevilen bir araç değil, doğru araç kullanıyoruz. Aşağıdaki teknolojileri günlük olarak deneyimliyor, müşterilerimize ekstra eğitim gerektirmeden devir alıyoruz."
          />
          <Reveal>
            <div className="mt-12 flex flex-wrap gap-2">
              {techStack.map((t) => (
                <span
                  key={t.name}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  <Wrench className="h-3.5 w-3.5 text-violet-300" />
                  {t.name}
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/35 group-hover:text-white/55">
                    {t.category}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Fiyatlandırma yaklaşımı */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Fiyatlandırma"
            title="Şeffaf, üç farklı modelle"
            description="Hangi hizmeti aldığınıza göre fiyatlandırma modeli farklılaşır. Aşağıda tipik aralıkları paylaşıyoruz; net teklif keşif görüşmesinden sonra çıkarılır."
          />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
            {pricingModels.map((p) => (
              <Reveal key={p.title}>
                <div className="card flex h-full flex-col">
                  <TrendingUp className="h-5 w-5 text-violet-300" />
                  <h4 className="mt-5 font-display text-xl font-semibold">
                    {p.title}
                  </h4>
                  <p className="mt-2 text-sm gradient-text font-display text-xl">
                    {p.range}
                  </p>
                  <p className="mt-4 text-sm text-white/60">{p.desc}</p>
                  <p className="mt-auto pt-6 text-xs uppercase tracking-[0.16em] text-white/40">
                    Uygun: {p.fits}
                  </p>
                </div>
              </Reveal>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-sm text-white/50">
              Sürpriz fatura, gizli kalem, başlangıç ücreti yok. Sözleşme öncesi tüm
              detaylar yazılı paylaşılır.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Hizmet FAQ */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Sık Sorulanlar"
            title="Hizmetlere özel sorular"
            description="Aklında olup da burada cevabını bulamadığın bir konu varsa, iletişim sayfasından bize doğrudan sorabilirsin."
          />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            {serviceFaqs.map((f) => (
              <details
                key={f.q}
                className="group p-6 transition hover:bg-white/[0.02]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-medium text-white">{f.q}</span>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 transition group-open:rotate-45 group-open:bg-violet-500/20 group-open:text-violet-200">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{f.a}</p>
              </details>
            ))}
          </div>
          <Reveal delay={0.1}>
            <p className="mt-8 text-center text-sm text-white/50">
              Daha fazla soru için{" "}
              <a
                className="text-white underline-offset-4 hover:underline"
                href={`mailto:${brand.email}`}
              >
                {brand.email}
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
