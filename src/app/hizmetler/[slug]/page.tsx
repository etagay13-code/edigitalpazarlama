import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Sparkles,
  Wrench,
  Trophy,
  UsersRound,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { services } from "@/lib/services";
import { brand } from "@/lib/theme";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal, Stagger } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { GradientBlobs } from "@/components/GradientBlob";

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return { title: "Hizmet Bulunamadı" };
  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: `${service.title} · ${brand.name}`,
      description: service.description,
    },
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const Icon = service.icon;
  const related = service.relatedSlugs
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is (typeof services)[number] => Boolean(s));

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pb-12 pt-8 sm:pt-16">
        <GradientBlobs />
        <div className="container-x relative">
          {/* Breadcrumb */}
          <nav
            aria-label="Yol"
            className="mb-10 flex items-center gap-2 text-sm text-white/45"
          >
            <Link href="/" className="hover:text-white">
              Anasayfa
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/hizmetler" className="hover:text-white">
              Hizmetler
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{service.title}</span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-[1fr_auto]">
            <Reveal>
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${service.accent} shadow-glow`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <span className="eyebrow">Hizmet</span>
                </div>
                <h1 className="mt-8 h-display text-4xl font-semibold leading-[1.05] sm:text-5xl md:text-6xl">
                  {service.title}
                </h1>
                <p className="mt-6 text-lg text-white/70 sm:text-xl">
                  {service.hero}
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link href="/iletisim" className="btn-primary">
                    Bu Hizmet İçin Teklif Al
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/portfolyo" className="btn-ghost">
                    Bu Alandaki Örnekler
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <aside className="card w-full max-w-sm lg:w-80">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  Kimler için ideal?
                </p>
                <ul className="mt-4 space-y-3">
                  {service.idealFor.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/75">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20">
                        <UsersRound className="h-3 w-3 text-violet-200" />
                      </span>
                      {i}
                    </li>
                  ))}
                </ul>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="section">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <span className="eyebrow">Yaklaşımımız</span>
            <h2 className="mt-5 h-display text-3xl font-semibold leading-tight sm:text-4xl">
              Bu hizmeti{" "}
              <span className="gradient-text">nasıl ele alıyoruz</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-white/70">{service.approach}</p>
            {service.longDescription && (
              <p className="mt-4 text-sm text-white/55">{service.longDescription}</p>
            )}
          </Reveal>
        </div>
      </section>

      {/* What's included + Deliverables */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Kapsam"
            title="Bu hizmet neleri içerir?"
            description="Sözleşmede yer almayan vaatler vermiyoruz. Aşağıdaki kapsam tamamen yazılı taahhüt edilen liste."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <div className="card">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  Hizmet kapsamı
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                    >
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-violet-500/20">
                        <Check className="h-3 w-3 text-violet-200" />
                      </span>
                      <span className="text-sm text-white/75">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card h-full">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  Çıktılar
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.deliverables.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/[0.08] px-3 py-1.5 text-xs text-violet-100"
                    >
                      <Sparkles className="h-3 w-3 text-violet-300" />
                      {d}
                    </span>
                  ))}
                </div>

                <p className="mt-8 mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                  Beklenebilir sonuçlar
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.outcomes.map((o) => (
                    <span
                      key={o}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/[0.08] px-3 py-1.5 text-xs text-emerald-100"
                    >
                      <Trophy className="h-3 w-3 text-emerald-300" />
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Süreç */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Süreç"
            title="İş başı yapışımızdan ilk sonuca"
            description="Birlikte çalışmaya başladığımız andan teslim/yayın anına kadar geçtiğimiz adımlar."
          />

          <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {service.process.map((step, i) => (
              <Reveal key={step.title}>
                <div className="card relative h-full">
                  <span className="font-display text-xs font-semibold tracking-[0.2em] text-violet-300">
                    0{i + 1}
                  </span>
                  <h4 className="mt-5 font-display text-lg font-semibold">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm text-white/60">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Araçlar */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Araçlar"
            title="Kullandığımız stack"
            description="Sevilen değil, doğru araç. Bu hizmet için günlük olarak kullandığımız platformlar."
          />
          <Reveal>
            <div className="mt-10 flex flex-wrap gap-2">
              {service.tools.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:bg-white/[0.07]"
                >
                  <Wrench className="h-3.5 w-3.5 text-violet-300" />
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Sık Sorulanlar"
            title={`${service.title} ile ilgili sorular`}
            description="Aklında olup da burada cevabını bulamadığın bir soru varsa, iletişim sayfasından bize doğrudan ulaşabilirsin."
          />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            {service.faq.map((f) => (
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
        </div>
      </section>

      {/* İlgili hizmetler */}
      {related.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow="İlgili Hizmetler"
              title="Bu hizmetle birlikte tercih edilenler"
              description="Bu hizmeti tek başına alabilirsiniz, ama aşağıdaki hizmetlerle birlikte tercih edildiğinde sinerji çok daha güçlü oluyor."
            />
            <Stagger className="mt-12 grid gap-5 md:grid-cols-3">
              {related.map((r) => {
                const RIcon = r.icon;
                return (
                  <Reveal key={r.slug}>
                    <Link
                      href={`/hizmetler/${r.slug}`}
                      className="card group block h-full"
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${r.accent} shadow-glow`}
                        >
                          <RIcon className="h-5 w-5 text-white" />
                        </div>
                        <ArrowUpRight className="h-5 w-5 text-white/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                      </div>
                      <h3 className="mt-5 font-display text-lg font-semibold">
                        {r.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/60">{r.short}</p>
                    </Link>
                  </Reveal>
                );
              })}
            </Stagger>
          </div>
        </section>
      )}

      {/* Geri dönüş */}
      <section className="pt-4">
        <div className="container-x">
          <Reveal>
            <Link
              href="/hizmetler"
              className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Tüm hizmetlere dön
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}
