import type { Metadata } from "next";
import {
  Target,
  Eye,
  HeartHandshake,
  Sparkles,
  ShieldCheck,
  Gauge,
  Users,
  Lightbulb,
  Award,
  Trophy,
  Briefcase,
  Coffee,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal, Stagger } from "@/components/Reveal";
import { CTASection } from "@/components/CTASection";
import { GradientBlobs } from "@/components/GradientBlob";
import { Counter } from "@/components/Counter";
import { brand } from "@/lib/theme";
import { timeline, team } from "@/lib/timeline";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: `${brand.name} ve kurucu ${brand.founder} hakkında bilgi alın. Vizyonumuz, misyonumuz ve markaları büyütmek için izlediğimiz yol.`,
};

const values = [
  {
    icon: Sparkles,
    title: "Sahiplenme",
    desc: "Müşterimizin işine kendi işimiz gibi yaklaşıyoruz. Sorumluluk parantezler arasında kalmıyor; sonuçlarla ölçülüyor.",
  },
  {
    icon: ShieldCheck,
    title: "Şeffaflık",
    desc: "Bütçe, performans ve süreçler her zaman açık. Sürprizler kampanya optimizasyonlarında olur, fatura kalemlerinde değil.",
  },
  {
    icon: Gauge,
    title: "Hız",
    desc: "Bir testin sonucu birkaç gün içinde elimizde olur. Yavaş ajans çağı geride kaldı; hız bizim için bir disiplin.",
  },
  {
    icon: Users,
    title: "Uzmanlık",
    desc: "Generalist değil, uzman. Reklam, SEO, geliştirme, içerik — her alan kendi içinde ustalaşmış ekiplerce yönetiliyor.",
  },
  {
    icon: HeartHandshake,
    title: "Uzun Vade",
    desc: "Tek kampanyalık iş ortaklığı kurmuyoruz. 3 ay ya da 3 yıl, hedefimiz markanızın sürdürülebilir büyümesi.",
  },
  {
    icon: Lightbulb,
    title: "Yaratıcılık",
    desc: "Data güzeldir, ama yaratıcılık olmadan bir şey ifade etmez. İkisi bir araya geldiğinde markalar fark yaratır.",
  },
];

const why = [
  {
    title: "Tek bir ekipten 360°",
    desc: "Reklam, SEO, sosyal medya, web ve mobil geliştirme için ayrı ajanslarla uğraşmak yerine her şeyi tek bir noktada koordine ediyoruz. İletişim sürtüşmesi sıfır, hız maksimum.",
  },
  {
    title: "Performansa bağlı raporlama",
    desc: "Aylık raporlar markanın gerçek hedefleriyle eşleşir. Beğeni ve gösterim sayıları değil; satış, lead ve ROAS gibi gerçek metrikler.",
  },
  {
    title: "Kurucunun doğrudan dahil olması",
    desc: "Junior'lara devredilmeyen, kurucu Emre Tagay'ın stratejik kararlarda doğrudan rol aldığı bir çalışma modeli.",
  },
  {
    title: "Teknoloji + Pazarlama hibrit DNA'sı",
    desc: "SaaS ve mobil uygulama geliştirebildiğimiz için pazarlama kampanyaları teknik altyapıyı da düşünür. Bu kombinasyon, ajansların büyük çoğunluğunda yok.",
  },
];

const stats = [
  { label: "Yıldır faaliyetteyiz", to: 7, suffix: "+" },
  { label: "Aktif müşteri", to: 60, suffix: "+" },
  { label: "Tamamlanan proje", to: 320, suffix: "+" },
  { label: "Ekip arkadaşımız", to: 14, suffix: "" },
];

const culture = [
  {
    icon: Coffee,
    title: "Async-first çalışma kültürü",
    desc: "Toplantıyı gerçekten gerektiren konular için toplantı yapıyoruz. Geri kalanı Notion ve Slack üzerinden async ilerliyor.",
  },
  {
    icon: Trophy,
    title: "Sonuç odaklı, mesai odaklı değil",
    desc: "9-6 değil; hedef-deadline modeli. Ekibimiz hibrit çalışıyor, ofise gelmek tercih, zorunluluk değil.",
  },
  {
    icon: Award,
    title: "Sürekli öğrenme bütçesi",
    desc: "Her ekip arkadaşımıza yıllık kurs, konferans ve kitap bütçesi sağlıyoruz. Bilgi yaşlanır, biz tazelemekten yorulmuyoruz.",
  },
  {
    icon: Briefcase,
    title: "Anonim müşteri geri bildirimi",
    desc: "Müşteri NPS skorlarını üçer aylık ölçüyoruz. Düşen skorlar ekip OKR'larında doğrudan etki yapıyor.",
  },
];

const recognitions = [
  { title: "Google Premier Partner", year: "2023, 2024, 2025, 2026" },
  { title: "Meta Business Partner", year: "2022 – devam ediyor" },
  { title: "Clutch Top B2B", year: "Türkiye 2024, 2025" },
  { title: "Awwwards Honorable Mention", year: "2 web projesi (2024)" },
  { title: "Mağaza onayı", year: "%100 başarı (mobil uyg.)" },
  { title: "Ortalama müşteri NPS", year: "9.2 / 10" },
];

export default function AboutPage() {
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
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Değerlerimiz"
            title="Bizi biz yapan altı disiplin"
            description="Bir ekip kültürü kelimelerden değil, günlük kararlardan oluşur. İşte bizim her sabah masaya getirdiğimiz altı disiplin."
          />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title}>
                  <div className="card h-full">
                    <Icon className="h-6 w-6 text-violet-300" />
                    <h4 className="mt-5 font-display text-lg font-semibold">
                      {v.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">{v.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Çalışma kültürü */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="İçeriden bir bakış"
            title="Ofisimizde nasıl çalışıyoruz?"
            description="Çalışan deneyiminin müşteri deneyimini doğrudan etkilediğine inanıyoruz. Bu yüzden ekibimizin çalışma şartlarını ciddiye alıyoruz."
          />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {culture.map((c) => {
              const Icon = c.icon;
              return (
                <Reveal key={c.title}>
                  <div className="card h-full">
                    <Icon className="h-5 w-5 text-violet-300" />
                    <h4 className="mt-5 font-display text-base font-semibold">
                      {c.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">{c.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Sertifikalar & ödüller */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Sertifikalar"
            title="Sektörel onaylar ve tanınırlık"
            description="Ödüller işin merkezi değil ama dış doğrulamaya değer veriyoruz. İşte hesaplarımızı yöneten platformların ve sektörün bizi nasıl tanıdığı."
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

      {/* Neden biz */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Neden Biz?"
            title="Diğer ajanslardan farkımız"
            description="Daha iyi olmak zor; farklı olmak imkansız değil. Müşterilerimizin tekrar tekrar duyduğu sebepler:"
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

      <CTASection />
    </>
  );
}
