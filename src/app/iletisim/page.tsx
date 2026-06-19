import type { Metadata } from "next";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  MessageCircle,
  CalendarClock,
  ClipboardList,
  Compass,
  Rocket,
  ShieldCheck,
  Globe,
  Building2,
  Coffee,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactForm } from "@/components/ContactForm";
import { Reveal, Stagger } from "@/components/Reveal";
import { GradientBlobs } from "@/components/GradientBlob";
import { brand } from "@/lib/theme";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Bizimle bağlantıya geçin. Ücretsiz 30 dakikalık keşif görüşmesi ve 48 saat içinde geri dönüş garantisi.",
};

const channels = [
  {
    icon: Mail,
    label: "E-posta",
    value: brand.email,
    href: `mailto:${brand.email}`,
    hint: "En hızlı yanıt",
  },
  {
    icon: Phone,
    label: "Telefon",
    value: brand.phone,
    href: `tel:${brand.phone.replace(/\s/g, "")}`,
    hint: "Mesai içinde",
  },
  {
    icon: MapPin,
    label: "Ofis",
    value: brand.address,
    href: "https://maps.google.com/?q=Istanbul",
    hint: "Maslak / Levent çevresi",
  },
  {
    icon: Clock,
    label: "Çalışma Saatleri",
    value: "Hafta içi 09:00 — 18:30",
    href: null,
    hint: "Acil için 7/24 nöbetçi",
  },
];

const process = [
  {
    icon: ClipboardList,
    title: "Form gönderimi",
    desc: "Aşağıdaki formu doldurun. Hedefiniz, mevcut durumunuz ve beklentileriniz hakkında kısa bir özet yeterli.",
    time: "0 dk",
  },
  {
    icon: Compass,
    title: "Hızlı ön inceleme",
    desc: "48 saat içinde size dönüş yaparız. Müsait olduğunuz iki-üç zaman dilimi için keşif görüşmesi takvimleriz.",
    time: "0 – 48 saat",
  },
  {
    icon: CalendarClock,
    title: "Keşif görüşmesi",
    desc: "30 dakikalık video görüşme. Hedef, bütçe, mevcut kanallar konuşulur. Görüşme sonunda somut bir aksiyon planı taslağı çıkarıyoruz.",
    time: "Hafta 1",
  },
  {
    icon: Rocket,
    title: "Teklif ve start",
    desc: "Ücretsiz teklif belgesini iletiyoruz. Onay sonrası 5 iş günü içinde projeye başlıyoruz.",
    time: "Hafta 1 – 2",
  },
];

const guarantees = [
  {
    icon: ShieldCheck,
    title: "İlk 90 günde ölçülebilir iyileşme",
    desc: "Tanımladığımız KPI'larda iyileşme olmazsa sözleşme bağlayıcı değildir. Şartlar yazılı.",
  },
  {
    icon: Globe,
    title: "Şeffaf raporlama",
    desc: "Looker Studio canlı dashboard. Reklam kreatiflerinden gider kalemlerine kadar her şey açık.",
  },
  {
    icon: MessageCircle,
    title: "Mesai içi hızlı yanıt",
    desc: "Slack veya WhatsApp üzerinden ortalama 28 dakikada ilk yanıt. Sessizlik bizim sözlüğümüzde yok.",
  },
  {
    icon: Coffee,
    title: "İlk görüşme ücretsiz",
    desc: "Keşif görüşmesi tamamen ücretsizdir. Sonrasında ortak olmak zorunda değilsiniz.",
  },
];

const contactFaqs = [
  {
    q: "Yanıt ne kadar sürede gelir?",
    a: "Hafta içi gelen form başvurularına ortalama 6-12 saatte, hafta sonu gelen başvurulara ise pazartesi öğlene kadar dönüş sağlıyoruz.",
  },
  {
    q: "Görüşmeye ne hazırlamalıyım?",
    a: "Mevcut hedefleriniz, varsa son 3 ayın performans dataları, web/uygulama/sosyal medya analytics erişimleri (sadece görüntüleme için) ve mümkünse referans markalarınız. Hiçbiri hazır olmasa bile görüşme yine de verimli geçer.",
  },
  {
    q: "Bütçemi paylaşmam zorunlu mu?",
    a: "Hayır ama yardımcı oluyor. Bütçe bandı belirsizse görüşmede birlikte netleştiriyoruz. Sizinle bütçe modelinizden bağımsız olarak konuşuyoruz.",
  },
  {
    q: "Yurt dışından çalışabilir miyim?",
    a: "Elbette. Müşterilerimizin %30'u yurt dışı merkezli (UK, US, AE). Tüm görüşmelerimizi Türkçe veya İngilizce yapabiliriz.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader
            eyebrow="İletişim"
            title="Bir sonraki büyüme dönemini konuşalım"
            description="Aşağıdaki formu doldurun ya da bize doğrudan ulaşın. Tüm yeni başvurulara 48 saat içinde dönüş sağlıyoruz."
          />
        </div>
      </section>

      {/* Form + kanal kartları */}
      <section className="section pt-4">
        <div className="container-x grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              {channels.map((c) => {
                const Icon = c.icon;
                const content = (
                  <div className="card flex items-center gap-4">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                        {c.label}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-white">
                        {c.value}
                      </p>
                      <p className="mt-0.5 text-xs text-white/40">{c.hint}</p>
                    </div>
                  </div>
                );
                return c.href ? (
                  <a
                    key={c.label}
                    href={c.href}
                    className="block"
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={c.label}>{content}</div>
                );
              })}

              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Sosyal Medya
                </p>
                <div className="mt-3 flex gap-2">
                  <a
                    href={brand.socials.instagram}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <Instagram className="h-4 w-4" /> Instagram
                  </a>
                  <a
                    href={brand.socials.linkedin}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </div>
                <p className="mt-4 text-xs text-white/40">
                  DM kanallarımız da aktif — ama detaylı projeler için e-posta önerilir.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Süreç */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Süreç"
            title="Formu gönderdikten sonra ne olur?"
            description="Karanlık bir kutu içine başvuru göndermek istemezsiniz. İşte adım adım: formu gönderdiğiniz andan sözleşme imzasına kadar."
          />
          <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {process.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title}>
                  <div className="card relative h-full">
                    <span className="font-display text-xs font-semibold tracking-[0.2em] text-violet-300">
                      0{i + 1}
                    </span>
                    <Icon className="mt-4 h-6 w-6 text-violet-300" />
                    <h4 className="mt-5 font-display text-lg font-semibold">
                      {p.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">{p.desc}</p>
                    <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-white/55">
                      <Clock className="h-3 w-3" />
                      {p.time}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* Garantiler */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Beraber Çalışma Şartları"
            title="Bizden ne bekleyebilirsiniz?"
            description="Sözlü vaat değil, yazılı taahhüt. İşte ortaklık başlamadan önce size garanti edebileceğimiz dört temel şart."
          />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {guarantees.map((g) => {
              const Icon = g.icon;
              return (
                <Reveal key={g.title}>
                  <div className="card h-full">
                    <Icon className="h-6 w-6 text-violet-300" />
                    <h4 className="mt-5 font-display text-lg font-semibold">
                      {g.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">{g.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* İletişim FAQ */}
      <section className="section">
        <div className="container-x">
          <SectionHeader
            eyebrow="Sık Sorulanlar"
            title="İletişim ve görüşme süreci"
            description="Sözleşme öncesi olası soruların hızlı cevapları. Daha fazlasını sormak için form yeterli."
          />
          <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            {contactFaqs.map((f) => (
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

      {/* Ofis / Harita */}
      <section className="section pt-4">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <Reveal>
              <div className="card h-full">
                <Building2 className="h-6 w-6 text-violet-300" />
                <h3 className="mt-5 font-display text-2xl font-semibold">Ofisimiz</h3>
                <p className="mt-3 text-sm text-white/65">
                  Maslak'ta hibrit çalışan bir ekiple Salı ve Perşembe günleri tam dolu
                  bir ofisimiz var. Buluşmak istediğinizde önceden randevulaşmak
                  yeterli — kapımız her zaman açık ama kahvemiz biterse hep birlikte
                  yenisini demlemek lazım.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/65">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-violet-300" />
                    {brand.address} — Maslak Plaza, Kat 7
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-violet-300" />
                    Hafta içi 09:00 – 18:30 (Salı/Perşembe tam ofis)
                  </li>
                  <li className="flex items-start gap-3">
                    <Coffee className="mt-0.5 h-4 w-4 text-violet-300" />
                    Buluşmadan önce kahve siparişinizi paylaşmayı unutmayın
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/[0.06]">
                <div className="relative h-72 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 sm:h-full sm:min-h-[360px]">
                  <div className="absolute inset-0 bg-grid-faint bg-grid opacity-40" />
                  <div
                    aria-hidden
                    className="absolute -left-32 -top-20 h-72 w-72 rounded-full bg-violet-600/30 blur-[120px]"
                  />
                  <div
                    aria-hidden
                    className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-cyan-500/30 blur-[120px]"
                  />
                  <div className="relative grid h-full place-items-center text-center">
                    <div className="px-6">
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/[0.06] backdrop-blur">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <p className="mt-4 font-display text-xl font-semibold">
                        {brand.address}
                      </p>
                      <p className="mt-1 text-sm text-white/55">
                        Detaylı yol tarifi için yukarıdaki ofis kartına tıklayın.
                      </p>
                      <a
                        href="https://maps.google.com/?q=Maslak,Istanbul"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/[0.1] hover:text-white"
                      >
                        Google Maps'te Aç
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
