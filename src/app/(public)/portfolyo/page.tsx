import type { Metadata } from "next";
import { TrendingUp, Quote, MessageSquare, BarChart3, Trophy, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CTASection } from "@/components/CTASection";
import { GradientBlobs } from "@/components/GradientBlob";
import { Reveal, Stagger } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { listPortfolioProjectsPublic } from "@/lib/data";

export const metadata: Metadata = {
  title: "Portfolyo",
  description:
    "Birlikte çalıştığımız markalar için ürettiğimiz başarı hikayeleri. Reklam, SEO, mobil ve SaaS projelerinden seçkiler.",
};

const stats = [
  { label: "Tamamlanan kampanya", to: 320, suffix: "+" },
  { label: "Toplam yönetilen reklam bütçesi", to: 18, prefix: "₺", suffix: "M+" },
  { label: "Ortalama ROAS", to: 4.6, suffix: "x", decimals: 1 },
  { label: "Müşteri NPS", to: 92, suffix: "/100" },
];

const sectors = [
  "E-ticaret",
  "SaaS",
  "Fintech",
  "Sağlık Turizmi",
  "Eğitim",
  "Moda",
  "Mobilite",
  "Kozmetik",
  "Gıda",
  "B2B Yazılım",
  "Emlak Tech",
  "Spor & Wellness",
];

const featuredMetrics = [
  { label: "ROAS", from: "2.1x", to: "4.8x", color: "from-violet-500 to-indigo-500" },
  { label: "Aylık Gelir", from: "₺320K", to: "₺1.1M", color: "from-cyan-500 to-blue-500" },
  { label: "CPA", from: "₺412", to: "₺178", color: "from-emerald-500 to-cyan-500" },
  { label: "Müşteri Sayısı", from: "1.8K", to: "6.4K", color: "from-pink-500 to-rose-500" },
];

const caseSteps = [
  {
    title: "Audit & Strateji (Hafta 1-2)",
    desc: "Mevcut hesapları, dataları ve müşteri davranışını derinlemesine analiz ettik. 3 hipotez belirledik: yanlış hedefleme, kreatif yorgunluğu ve landing page sızıntısı.",
  },
  {
    title: "Restrukturasyon (Hafta 3-6)",
    desc: "Hesap yapısını ASC + Advantage+ ağırlıklı olarak yeniden kurguladık. 18 yeni kreatif konsepti, 4 farklı landing page ile A/B testler başladı.",
  },
  {
    title: "Ölçek (Hafta 7-12)",
    desc: "Kazanan kreatifleri farklı segmentlere ölçeklendirdik, Meta + Google attribution modelini birleştirdik, e-mail flow'ları güçlendirdik.",
  },
  {
    title: "Sürdürülebilir büyüme (Hafta 13+)",
    desc: "ROAS 4.8x, müşteri sayısı 6.4K, ortalama sepet değeri %22 yükseldi. Aylık iterasyon ritmiyle kazançlar korunuyor.",
  },
];

export default async function PortfolioPage() {
  const projects = await listPortfolioProjectsPublic();
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader
            eyebrow="Çalışmalarımız"
            title="Birlikte büyüttüğümüz markalar"
            description="Her proje farklı bir hedefle yola çıktı; ama hepsinde ortak olan tek şey ölçülebilir sonuçlar. Aşağıda, paylaşma izni aldığımız çalışmalardan örnekler."
          />
        </div>
      </section>

      {/* Stats */}
      <section className="section pt-4">
        <div className="container-x">
          <Reveal>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-ink-900/60 p-8">
                  <div className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                    <span className="gradient-text">
                      <Counter
                        to={s.to}
                        prefix={s.prefix ?? ""}
                        suffix={s.suffix ?? ""}
                        decimals={s.decimals ?? 0}
                      />
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/55">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Öne çıkan vaka */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Öne Çıkan Vaka"
            title="Lumen Cosmetics — ROAS 2.1x → 4.8x"
            description="Yorulmuş bir reklam hesabı, kanıksanmış bir kreatif yaklaşımı ve fragmente bir analytics altyapısı. Üç aylık restrukturasyon ile rakamların nasıl katlandığını gösteriyoruz."
          />

          <Reveal>
            <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-4">
              {featuredMetrics.map((m) => (
                <div key={m.label} className="bg-ink-900/60 p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                    {m.label}
                  </p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-display font-semibold text-white/40 line-through">
                      {m.from}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                  </div>
                  <p
                    className={`mt-1 font-display text-3xl font-semibold bg-gradient-to-br ${m.color} bg-clip-text text-transparent`}
                  >
                    {m.to}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <div className="card h-full">
                <Quote className="h-7 w-7 text-violet-300" />
                <p className="mt-5 font-display text-lg leading-relaxed text-white/85">
                  "E-Digital ile çalıştığımız 6 ayda ROAS'ımız 2.1'den 4.8'e çıktı. En
                  etkileyici olan şey rakamlar değil, ekip dinamiği — markamızı bizim
                  kadar sahipleniyorlar."
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 font-display font-semibold text-white">
                    SA
                  </div>
                  <div>
                    <p className="font-semibold text-white">Selin Aksoy</p>
                    <p className="text-sm text-white/55">
                      Pazarlama Direktörü · Lumen Cosmetics
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  <BarChart3 className="h-4 w-4" />
                  4 fazda 6 aylık çalışma
                </div>
                <ol className="mt-6 space-y-5">
                  {caseSteps.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-violet-400/30 bg-violet-500/10 text-xs font-semibold text-violet-200">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-white">{s.title}</p>
                        <p className="mt-1 text-sm text-white/60">{s.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Filtreli grid */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Tüm Projeler"
            title="Kategorilere göre çalışmalarımız"
            description="Filtrelerle ilgilendiğin kategoriye daralt. Her kartta projenin ölçüt aldığı temel KPI'yı paylaşıyoruz."
          />
          <div className="mt-10">
            <PortfolioGrid items={projects} />
          </div>
        </div>
      </section>

      {/* Sektörler */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Sektör Çeşitliliği"
            title="Çalıştığımız sektörler"
            description="Sektör çeşitliliği bizim için güçlü bir avantaj: bir sektörde işe yarayan bir öğrenmeyi diğerlerine taşıyabiliyoruz."
          />
          <Reveal>
            <div className="mt-10 flex flex-wrap gap-2">
              {sectors.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  <Trophy className="h-3.5 w-3.5 text-violet-300" />
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Müşteri sesleri özet */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Müşterilerimizin Sözleri"
            title="Geri bildirim üzerine kuruluyuz"
            description="Müşteri NPS skorlarını üçer aylık ölçüyoruz; bu skorlar ekibin OKR'larına doğrudan etki ediyor."
          />
          <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                quote:
                  "Şeffaf raporlama, hızlı iletişim ve doğru beklenti yönetimi. Ajans değişimi yaparken aradığımız her şeyi tek bir yerde bulduk.",
                name: "Onur Şahin",
                role: "Kurucu Ortak · Greenly Foods",
              },
              {
                quote:
                  "MVP'mizi 8 haftada yayınladılar. Sadece kod yazmadılar; ürün stratejisinden onboarding flow'una kadar gerçek bir teknoloji ortağı gibi davrandılar.",
                name: "Kerem Doğan",
                role: "Kurucu · Tessera SaaS",
              },
              {
                quote:
                  "SEO ekibi farkı net gösterdi. 9 ay içinde organik trafiğimiz 4.6 katına çıktı, marka kelimelerimizde 1. sıradayız ve bu trafik artık satışa dönüşüyor.",
                name: "Beyza Yılmaz",
                role: "E-ticaret Müdürü · Nordel Home",
              },
            ].map((t) => (
              <Reveal key={t.name}>
                <div className="card h-full">
                  <MessageSquare className="h-5 w-5 text-violet-300" />
                  <p className="mt-5 text-white/85">"{t.quote}"</p>
                  <div className="mt-6 border-t border-white/[0.06] pt-4">
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-white/45">
                      {t.role}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Çalışma daveti */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="card flex flex-col items-center gap-6 p-10 text-center sm:p-14">
              <TrendingUp className="h-10 w-10 text-violet-300" />
              <h3 className="h-display text-3xl font-semibold sm:text-4xl">
                Sıra <span className="gradient-text">sizin markanızda</span>
              </h3>
              <p className="max-w-2xl text-white/65">
                Bu rakamlar, bizi seçen markaların başardıklarıdır. Bir sonraki vaka
                çalışmasında sizin markanızı paylaşmak istiyoruz.
              </p>
              <Link href="/iletisim" className="btn-primary">
                Görüşme Planla
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
