import type { Metadata } from "next";
import { Target, Eye, HeartHandshake, Award } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal, Stagger } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { GradientBlobs } from "@/components/GradientBlob";
import { Counter } from "@/components/Counter";
import { DynamicIcon } from "@/components/DynamicIcon";
import { getBrand } from "@/lib/theme";
import { getPageSection, listTimelinePublic, listTeamPublic } from "@/lib/data";

type IconItem = { icon?: string; title: string; desc: string };
type TextItem = { title: string; desc: string };
type RecognitionItem = { title: string; year: string };

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrand();
  return {
    title: "Hakkımızda",
    description: `${brand.name} ve kurucu ${brand.founder} hakkında bilgi alın. Vizyonumuz, misyonumuz ve markaları büyütmek için izlediğimiz yol.`,
  };
}

const stats = [
  { label: "Yıldır faaliyetteyiz", to: 7, suffix: "+" },
  { label: "Aktif müşteri", to: 60, suffix: "+" },
  { label: "Tamamlanan proje", to: 320, suffix: "+" },
  { label: "Ekip arkadaşımız", to: 14, suffix: "" },
];

export default async function AboutPage() {
  const [brand, timeline, team, valuesSection, cultureSection, recognitionsSection, whySection] =
    await Promise.all([
      getBrand(),
      listTimelinePublic(),
      listTeamPublic(),
      getPageSection("about", "values"),
      getPageSection("about", "culture"),
      getPageSection("about", "recognitions"),
      getPageSection("about", "why"),
    ]);

  const values = ((valuesSection?.body as { items?: IconItem[] } | null)?.items ?? []) as IconItem[];
  const culture = ((cultureSection?.body as { items?: IconItem[] } | null)?.items ?? []) as IconItem[];
  const recognitions = ((recognitionsSection?.body as { items?: RecognitionItem[] } | null)?.items ?? []) as RecognitionItem[];
  const why = ((whySection?.body as { items?: TextItem[] } | null)?.items ?? []) as TextItem[];
  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader
            eyebrow="Hakkımızda"
            title="Markaları büyütmek için kurulmuş bir ekip"
            description={`${brand.name}, performans pazarlaması ile teknoloji geliştirmenin kesiştiği noktada konumlanır. 2019'dan bu yana e-ticaret, SaaS ve hizmet markalarına dijital büyüme ortaklığı sunuyoruz.`}
          />
        </div>
      </section>

      {/* Rakamlarla biz */}
      <section className="section pt-4">
        <div className="container-x">
          <Reveal>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-ink-900/60 p-8 transition hover:bg-ink-800/60"
                >
                  <div className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                    <span className="gradient-text">
                      <Counter to={s.to} suffix={s.suffix} />
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-white/55">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hikaye + Misyon/Vizyon */}
      <section className="section">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <span className="eyebrow">Hikayemiz</span>
            <h3 className="mt-5 h-display text-3xl font-semibold sm:text-4xl">
              Kurucumuz {brand.founder}'ın hikayesi
            </h3>
            <div className="mt-6 space-y-4 text-white/65">
              <p>
                {brand.founder}, dijital pazarlama dünyasına 2015'te bir e-ticaret
                markasının kurucusu olarak girdi. Kendi markasını büyütmek için Google
                Ads, Meta Ads ve SEO öğrenmek zorunda kaldı — ve aslında pek çok
                Türkiye markasının da aynı sorunla boğuştuğunu fark etti: doğru ajansı
                bulamamak.
              </p>
              <p>
                Çoğu ajans büyük müşterilerle dolu ya da sadece tek alanda uzman. Hem
                stratejiyi düşünen, hem kreatifi üreten, hem teknolojiyi geliştiren
                bir partneri bulmak nadirdi. 2017-2019 arasında 12+ markaya freelance
                danışmanlık verdikten sonra "neden bunu bir ekip işine dönüştürmüyorum"
                sorusuyla {brand.name}'i kurdu.
              </p>
              <p>
                2019'da {brand.name}'i kurarken hedefi netti: müşterinin işine
                ortak gibi davranan, sayıların arkasındaki insanı unutmayan, hem
                kreatif hem teknik tarafa hakim bir ajans. Bugün İstanbul merkezli
                ekibimiz 14 kişiden oluşuyor; e-ticaretten fintech'e, sağlık
                turizminden SaaS girişimlerine kadar geniş bir portföye hizmet
                veriyoruz.
              </p>
              <p>
                Hâlâ her yeni proje kapsama alındığında ilk strateji görüşmesini
                kurucu olarak ben yapıyorum. Çünkü güven bir tek bu şekilde inşa
                edilir. Hızlı büyüyen bir ajans olsak da bu prensibimizi koruyacağız.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card">
                <Target className="h-6 w-6 text-violet-300" />
                <h4 className="mt-4 font-display text-lg font-semibold">Misyon</h4>
                <p className="mt-2 text-sm text-white/60">
                  Markaların dijital büyümesini, ölçülebilir ve sürdürülebilir bir
                  bilim haline getirmek. Her kararı veriyle alıp, her veriyi
                  yaratıcılıkla yorumlamak.
                </p>
              </div>
              <div className="card">
                <Eye className="h-6 w-6 text-cyan-300" />
                <h4 className="mt-4 font-display text-lg font-semibold">Vizyon</h4>
                <p className="mt-2 text-sm text-white/60">
                  Türkiye'nin teknolojiyi en iyi anlayan, performansı en iyi
                  yöneten dijital büyüme ortağı olmak. 2027'ye kadar 100 markaya
                  ortak olmuş bir yapıya ulaşmak.
                </p>
              </div>
              <div className="card sm:col-span-2">
                <HeartHandshake className="h-6 w-6 text-emerald-300" />
                <h4 className="mt-4 font-display text-lg font-semibold">Vaadimiz</h4>
                <p className="mt-2 text-sm text-white/60">
                  İlk 90 günde ölçülebilir iyileşme. Olmadığı takdirde sözleşme
                  bağlayıcı değil — şartlarımız ücretsiz keşif görüşmesinde net
                  paylaşılır. Sözümüze sözleşmede yer veriyoruz.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Zaman çizelgesi */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Yol Haritası"
            title="2015'ten bugüne yolculuğumuz"
            description="Bir ajansın sadece bugünkü hali değil, oraya nasıl geldiği de önemlidir. İşte bizim adımlarımız."
          />
          <div className="relative mt-14">
            <div
              aria-hidden
              className="absolute left-4 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-violet-500/40 via-white/10 to-transparent lg:left-1/2 lg:-translate-x-px"
            />
            <div className="space-y-10">
              {timeline.map((t, i) => {
                const right = i % 2 === 0;
                return (
                  <Reveal key={t.year} delay={i * 0.03}>
                    <div className="relative grid items-start gap-6 lg:grid-cols-2 lg:gap-12">
                      <span
                        aria-hidden
                        className="absolute left-4 top-2 grid h-3 w-3 -translate-x-1/2 place-items-center rounded-full bg-violet-500 shadow-glow lg:left-1/2"
                      />
                      <div
                        className={`pl-12 lg:pl-0 ${
                          right ? "lg:text-right lg:pr-12" : "lg:order-2 lg:pl-12"
                        }`}
                      >
                        <p className="font-display text-3xl font-semibold gradient-text">
                          {t.year}
                        </p>
                      </div>
                      <div
                        className={`pl-12 lg:pl-0 ${right ? "lg:order-2 lg:pl-12" : "lg:pr-12"}`}
                      >
                        <div className="card">
                          <h4 className="font-display text-lg font-semibold">
                            {t.title}
                          </h4>
                          <p className="mt-2 text-sm text-white/65">{t.description}</p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Ekip */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Ekip"
            title="Markanızla doğrudan çalışacak isimler"
            description="Junior asistanlara devredilen bir hesap planı yok. Aşağıdaki isimler, sizinle her hafta düzenli görüşen, projeyi sahiplenen kişiler."
          />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <Reveal key={m.name}>
                <div className="card flex h-full flex-col">
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${m.accent} font-display text-xl font-semibold text-white shadow-glow`}
                  >
                    {m.initials}
                  </div>
                  <h4 className="mt-5 font-display text-lg font-semibold">
                    {m.name}
                  </h4>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/45">
                    {m.role}
                  </p>
                  <p className="mt-3 text-sm text-white/60">{m.bio}</p>
                </div>
              </Reveal>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Değerler */}
      {values.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={valuesSection?.eyebrow ?? undefined}
              title={valuesSection?.title ?? ""}
              description={valuesSection?.description ?? undefined}
            />
            <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {values.map((v) => (
                <Reveal key={v.title}>
                  <div className="card h-full">
                    <DynamicIcon name={v.icon} className="h-6 w-6 text-violet-300" />
                    <h4 className="mt-5 font-display text-lg font-semibold">
                      {v.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">{v.desc}</p>
                  </div>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Çalışma kültürü */}
      {culture.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={cultureSection?.eyebrow ?? undefined}
              title={cultureSection?.title ?? ""}
              description={cultureSection?.description ?? undefined}
            />
            <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {culture.map((c) => (
                <Reveal key={c.title}>
                  <div className="card h-full">
                    <DynamicIcon name={c.icon} className="h-5 w-5 text-violet-300" />
                    <h4 className="mt-5 font-display text-base font-semibold">
                      {c.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">{c.desc}</p>
                  </div>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Sertifikalar & ödüller */}
      {recognitions.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={recognitionsSection?.eyebrow ?? undefined}
              title={recognitionsSection?.title ?? ""}
              description={recognitionsSection?.description ?? undefined}
            />
            <Stagger className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {recognitions.map((r) => (
                <Reveal key={r.title}>
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                    <div>
                      <p className="font-medium text-white">{r.title}</p>
                      <p className="mt-0.5 text-xs uppercase tracking-[0.16em] text-white/40">
                        {r.year}
                      </p>
                    </div>
                    <Award className="h-5 w-5 text-violet-300" />
                  </div>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Neden biz */}
      {why.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={whySection?.eyebrow ?? undefined}
              title={whySection?.title ?? ""}
              description={whySection?.description ?? undefined}
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {why.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.05}>
                  <div className="card h-full">
                    <span className="font-display text-xs font-semibold tracking-[0.2em] text-violet-300">
                      0{i + 1}
                    </span>
                    <h4 className="mt-4 font-display text-xl font-semibold">{w.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">{w.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
