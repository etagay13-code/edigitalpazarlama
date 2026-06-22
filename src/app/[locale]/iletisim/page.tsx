import type { Metadata } from "next";
import {
  Mail,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Building2,
} from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { ContactForm } from "@/components/ContactForm";
import { Reveal, Stagger } from "@/components/Reveal";
import { GradientBlobs } from "@/components/GradientBlob";
import { DynamicIcon } from "@/components/DynamicIcon";
import { getBrand } from "@/lib/theme";
import { listServicesPublic, listFaqsPublic, listPageSectionsPublic, getPageSection } from "@/lib/data";
import { asLocale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { pageMeta } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = asLocale(params.locale);
  const hero = await getPageSection("contact", "hero", locale);
  return pageMeta({
    locale,
    internalPath: "/iletisim",
    title: hero?.title,
    description: hero?.description,
  });
}

type ProcessItem = { icon?: string; title: string; desc: string; time: string };
type GuaranteeItem = { icon?: string; title: string; desc: string };
type ChannelItem = {
  icon?: string;
  label: string;
  bind?: string;
  value?: string;
  href?: string | null;
  hint?: string;
};
type OfficeLine = { icon?: string; text: string };

export default async function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = asLocale(params.locale);
  const t = getDict(locale);
  const [brand, services, sections, contactFaqs] = await Promise.all([
    getBrand(locale),
    listServicesPublic(locale),
    listPageSectionsPublic("contact", locale),
    listFaqsPublic("contact", locale),
  ]);

  const sec = (key: string) => sections.find((s) => s.section_key === key) ?? null;

  const heroSection = sec("hero");
  const processSection = sec("process");
  const guaranteesSection = sec("guarantees");
  const faqHeader = sec("faq_header");
  const channelsSection = sec("channels");
  const officeSection = sec("office");

  const process = ((processSection?.body as { items?: ProcessItem[] } | null)?.items ?? []) as ProcessItem[];
  const guarantees = ((guaranteesSection?.body as { items?: GuaranteeItem[] } | null)?.items ?? []) as GuaranteeItem[];

  // Kanallar: DB'den, "bind" ile Site Ayarları'na bağlı (email/phone/address) veya düz değer.
  const resolveChannel = (c: ChannelItem) => {
    if (c.bind === "email")
      return { icon: c.icon || "Mail", label: c.label, value: brand.email, href: `mailto:${brand.email}`, hint: c.hint };
    if (c.bind === "phone")
      return {
        icon: c.icon || "Phone",
        label: c.label,
        value: brand.phone,
        href: brand.phone ? `tel:${brand.phone.replace(/\s/g, "")}` : null,
        hint: c.hint,
      };
    if (c.bind === "address")
      return {
        icon: c.icon || "MapPin",
        label: c.label,
        value: brand.address,
        href: c.href || "https://maps.google.com/?q=Istanbul",
        hint: c.hint,
      };
    return { icon: c.icon, label: c.label, value: c.value ?? "", href: c.href ?? null, hint: c.hint };
  };

  const channelItems = ((channelsSection?.body as { items?: ChannelItem[] } | null)?.items ?? []) as ChannelItem[];
  const channels =
    channelItems.length > 0
      ? channelItems.map(resolveChannel)
      : [
          { icon: "Mail", label: "E-posta", value: brand.email, href: `mailto:${brand.email}`, hint: "En hızlı yanıt" },
          {
            icon: "Phone",
            label: "Telefon",
            value: brand.phone,
            href: brand.phone ? `tel:${brand.phone.replace(/\s/g, "")}` : null,
            hint: "Mesai içinde",
          },
          { icon: "MapPin", label: "Ofis", value: brand.address, href: "https://maps.google.com/?q=Istanbul", hint: "Maslak / Levent çevresi" },
          { icon: "Clock", label: "Çalışma Saatleri", value: "Hafta içi 09:00 — 18:30", href: null, hint: "Acil için 7/24 nöbetçi" },
        ];

  const officeLines = ((officeSection?.body as { items?: OfficeLine[] } | null)?.items ?? []) as OfficeLine[];
  const officeList: OfficeLine[] =
    officeLines.length > 0
      ? officeLines
      : [
          { icon: "MapPin", text: `${brand.address} — Maslak Plaza, Kat 7` },
          { icon: "Clock", text: "Hafta içi 09:00 – 18:30 (Salı/Perşembe tam ofis)" },
          { icon: "Coffee", text: "Buluşmadan önce kahve siparişinizi paylaşmayı unutmayın" },
        ];

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-12 sm:pt-20">
        <GradientBlobs />
        <div className="container-x">
          <SectionHeader
            eyebrow={heroSection?.eyebrow || "İletişim"}
            title={heroSection?.title || "Bir sonraki büyüme dönemini konuşalım"}
            description={
              heroSection?.description ||
              "Aşağıdaki formu doldurun ya da bize doğrudan ulaşın. Tüm yeni başvurulara 48 saat içinde dönüş sağlıyoruz."
            }
          />
        </div>
      </section>

      {/* Form + kanal kartları */}
      <section className="section pt-4">
        <div className="container-x grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <ContactForm
              services={services.map((s) => ({
                slug: s.slug,
                title: s.title,
              }))}
              locale={locale}
              dict={t.contactForm}
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-4">
              {channels.map((c) => {
                const content = (
                  <div className="card flex items-center gap-4">
                    <div className="icon-chip h-11 w-11 shrink-0">
                      <DynamicIcon name={c.icon} fallback={Mail} className="h-5 w-5 text-violet-300" />
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
                  {t.contactPage.socialMedia}
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
                  {t.contactPage.dmNote}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Süreç */}
      {process.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={processSection?.eyebrow ?? undefined}
              title={processSection?.title ?? ""}
              description={processSection?.description ?? undefined}
            />
            <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {process.map((p, i) => (
                <Reveal key={p.title}>
                  <div className="card relative h-full">
                    <span className="font-display text-xs font-semibold tracking-[0.2em] text-violet-300">
                      0{i + 1}
                    </span>
                    <DynamicIcon name={p.icon} className="mt-4 h-6 w-6 text-violet-300" />
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
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Garantiler */}
      {guarantees.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={guaranteesSection?.eyebrow ?? undefined}
              title={guaranteesSection?.title ?? ""}
              description={guaranteesSection?.description ?? undefined}
            />
            <Stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {guarantees.map((g) => (
                <Reveal key={g.title}>
                  <div className="card h-full">
                    <DynamicIcon name={g.icon} className="h-6 w-6 text-violet-300" />
                    <h4 className="mt-5 font-display text-lg font-semibold">
                      {g.title}
                    </h4>
                    <p className="mt-2 text-sm text-white/60">{g.desc}</p>
                  </div>
                </Reveal>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* İletişim FAQ */}
      {contactFaqs.length > 0 && (
        <section className="section">
          <div className="container-x">
            <SectionHeader
              eyebrow={faqHeader?.eyebrow || "Sık Sorulanlar"}
              title={faqHeader?.title || "İletişim ve görüşme süreci"}
              description={
                faqHeader?.description ||
                "Sözleşme öncesi olası soruların hızlı cevapları. Daha fazlasını sormak için form yeterli."
              }
            />
            <div className="mx-auto mt-10 max-w-3xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {contactFaqs.map((f) => (
                <details
                  key={f.id}
                  className="group p-6 transition hover:bg-white/[0.02]"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="font-medium text-white">{f.question}</span>
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/10 text-white/60 transition group-open:rotate-45 group-open:bg-violet-500/20 group-open:text-violet-200">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ofis / Harita */}
      <section className="section pt-4">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <Reveal>
              <div className="card h-full">
                <Building2 className="h-6 w-6 text-violet-300" />
                <h3 className="mt-5 font-display text-2xl font-semibold">
                  {officeSection?.title || "Ofisimiz"}
                </h3>
                <p className="mt-3 text-sm text-white/65">
                  {officeSection?.description ||
                    "Maslak'ta hibrit çalışan bir ekiple Salı ve Perşembe günleri tam dolu bir ofisimiz var. Buluşmak istediğinizde önceden randevulaşmak yeterli — kapımız her zaman açık ama kahvemiz biterse hep birlikte yenisini demlemek lazım."}
                </p>
                <ul className="mt-6 space-y-3 text-sm text-white/65">
                  {officeList.map((line, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <DynamicIcon name={line.icon} fallback={MapPin} className="mt-0.5 h-4 w-4 text-violet-300" />
                      {line.text}
                    </li>
                  ))}
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
                        {t.contactPage.mapsOpen}
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
