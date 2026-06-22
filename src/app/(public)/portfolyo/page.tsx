import type { Metadata } from "next";
import { TrendingUp, Quote, MessageSquare, BarChart3, Trophy, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CTASection } from "@/components/CTASection";
import { GradientBlobs } from "@/components/GradientBlob";
import { Reveal, Stagger } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { listPortfolioProjectsPublic, listPageSectionsPublic } from "@/lib/data";
import { Highlighted } from "@/components/Highlight";

export const metadata: Metadata = {
  title: "Portfolyo",
  description:
    "Birlikte çalıştığımız markalar için ürettiğimiz başarı hikayeleri. Reklam, SEO, mobil ve SaaS projelerinden seçkiler.",
};

type StatItem = { label: string; to: number; prefix?: string; suffix?: string; decimals?: number };
type MetricItem = { label: string; from: string; to: string; color: string };
type CaseStep = { title: string; desc: string };
type CaseQuote = { text: string; name: string; role: string; initials: string };
type FeaturedCaseBody = {
  metrics?: MetricItem[];
  quote?: CaseQuote;
  steps?: CaseStep[];
  durationLabel?: string;
};
type SummaryTestimonial = { quote: string; name: string; role: string };

export default async function PortfolioPage() {
  const [projects, sections] = await Promise.all([
    listPortfolioProjectsPublic(),
    listPageSectionsPublic("portfolio"),
  ]);

  const sec = (key: string) => sections.find((s) => s.section_key === key) ?? null;

  const heroSection = sec("hero");
  const projectsHeader = sec("projects_header");
  const inviteSection = sec("invite");
  const inviteBody =
    (inviteSection?.body as { highlight?: string; primaryLabel?: string; primaryHref?: string } | null) ?? {};

  const statsSection = sec("stats");
  const featuredCaseSection = sec("featured_case");
  const sectorsSection = sec("sectors");
  const summaryTestimonialsSection = sec("testimonials_summary");

  const stats = ((statsSection?.body as { items?: StatItem[] } | null)?.items ?? []) as StatItem[];
  const featuredCase = (featuredCaseSection?.body as FeaturedCaseBody | null) ?? {};
  const featuredMetrics = (featuredCase.metrics ?? []) as MetricItem[];
  const caseSteps = (featuredCase.steps ?? []) as CaseStep[];
  const caseQuote = featuredCase.quote;
  const sectors = ((sectorsSection?.body as { items?: string[] } | null)?.items ?? []) as string[];
  const summaryTestimonials = ((summaryTestimonialsSection?.body as { items?: SummaryTestimonial[] } | null)?.items ?? []) as SummaryTestimonial[];
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader
            eyebrow={heroSection?.eyebrow || "Çalışmalarımız"}
            title={heroSection?.title || "Birlikte büyüttüğümüz markalar"}
            description={
              heroSection?.description ||
              "Her proje farklı bir hedefle yola çıktı; ama hepsinde ortak olan tek şey ölçülebilir sonuçlar. Aşağıda, paylaşma izni aldığımız çalışmalardan örnekler."
            }
          />
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
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
      )}

      {/* Öne çıkan vaka */}
      {featuredCaseSection && (featuredMetrics.length > 0 || caseSteps.length > 0 || caseQuote) && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={featuredCaseSection.eyebrow ?? undefined}
              title={featuredCaseSection.title ?? ""}
              description={featuredCaseSection.description ?? undefined}
            />

            {featuredMetrics.length > 0 && (
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
            )}

            {(caseQuote || caseSteps.length > 0) && (
              <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
                {caseQuote && (
                  <Reveal>
                    <div className="card h-full">
                      <Quote className="h-7 w-7 text-violet-300" />
                      <p className="mt-5 font-display text-lg leading-relaxed text-white/85">
                        &quot;{caseQuote.text}&quot;
                      </p>
                      <div className="mt-6 flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 font-display font-semibold text-white">
                          {caseQuote.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{caseQuote.name}</p>
                          <p className="text-sm text-white/55">{caseQuote.role}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                )}

                {caseSteps.length > 0 && (
                  <Reveal delay={0.1}>
                    <div className="card">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                        <BarChart3 className="h-4 w-4" />
                        {featuredCase.durationLabel ?? ""}
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
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Filtreli grid */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow={projectsHeader?.eyebrow || "Tüm Projeler"}
            title={projectsHeader?.title || "Kategorilere göre çalışmalarımız"}
            description={
              projectsHeader?.description ||
              "Filtrelerle ilgilendiğin kategoriye daralt. Her kartta projenin ölçüt aldığı temel KPI'yı paylaşıyoruz."
            }
          />
          <div className="mt-10">
            <PortfolioGrid items={projects} />
          </div>
        </div>
      </section>

      {/* Sektörler */}
      {sectors.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={sectorsSection?.eyebrow ?? undefined}
              title={sectorsSection?.title ?? ""}
              description={sectorsSection?.description ?? undefined}
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
      )}

      {/* Müşteri sesleri özet */}
      {summaryTestimonials.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={summaryTestimonialsSection?.eyebrow ?? undefined}
              title={summaryTestimonialsSection?.title ?? ""}
              description={summaryTestimonialsSection?.description ?? undefined}
            />
            <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
              {summaryTestimonials.map((t) => (
                <Reveal key={t.name}>
                  <div className="card h-full">
                    <MessageSquare className="h-5 w-5 text-violet-300" />
                    <p className="mt-5 text-white/85">&quot;{t.quote}&quot;</p>
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
      )}

      {/* Çalışma daveti */}
      <section className="section">
        <div className="container-x">
          <Reveal>
            <div className="card flex flex-col items-center gap-6 p-10 text-center sm:p-14">
              <TrendingUp className="h-10 w-10 text-violet-300" />
              <h3 className="h-display text-3xl font-semibold sm:text-4xl">
                <Highlighted
                  text={inviteSection?.title || "Sıra sizin markanızda"}
                  highlight={inviteBody.highlight || "sizin markanızda"}
                />
              </h3>
              <p className="max-w-2xl text-white/65">
                {inviteSection?.description ||
                  "Bu rakamlar, bizi seçen markaların başardıklarıdır. Bir sonraki vaka çalışmasında sizin markanızı paylaşmak istiyoruz."}
              </p>
              <Link href={inviteBody.primaryHref || "/iletisim"} className="btn-primary">
                {inviteBody.primaryLabel || "Görüşme Planla"}
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
