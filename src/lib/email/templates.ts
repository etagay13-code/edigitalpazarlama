// Form e-postaları: formu dolduran kişiye teşekkür (formun dilinde) ve
// ajansa bildirim (Türkçe). E-posta istemcileri modern CSS'i desteklemediği
// için tablo düzeni + satır içi stil kullanılır; Gmail SVG göstermediğinden
// logo PNG'dir (public/email/logo.png).
import type { Locale } from "@/i18n/config";

export type FormType = "contact" | "audit";

export type EmailBrand = {
  name: string;
  url: string;
  email: string;
  phone: string;
  instagram?: string | null;
};

export type EmailPost = { title: string; url: string; readingMin?: number | null };

export type AuditPayload = {
  website?: string;
  sector?: string;
  channels?: string[];
  budget?: string;
  goal?: string;
};

type Copy = {
  subject: (name: string) => string;
  preheader: string;
  hello: (name: string) => string;
  intro: (website: string) => string;
  stepsTitle: string;
  steps: [string, string, string];
  summaryTitle: string;
  labels: { service: string; message: string; website: string; sector: string; budget: string };
  waTitle: string;
  waText: string;
  waButton: string;
  waMessage: string;
  readTitle: string;
  readMin: string;
  signoff: string;
  team: string;
  why: (site: string) => string;
};

type LocaleCopy = { contact: Copy; audit: Copy };

const shared = {
  tr: {
    summaryTitle: "Bize ilettikleriniz",
    labels: { service: "Hizmet", message: "Mesaj", website: "Web sitesi", sector: "Sektör", budget: "Aylık bütçe" },
    waTitle: "Beklemek istemiyor musunuz?",
    waText: "Acil bir konu varsa WhatsApp'tan doğrudan yazın; mesai saatlerinde dakikalar içinde dönüyoruz.",
    waButton: "WhatsApp'tan yazın",
    waMessage: "Merhaba, web sitenizdeki formu doldurdum.",
    readTitle: "Bu arada okuyabilecekleriniz",
    readMin: "dk okuma",
    signoff: "Görüşmek üzere,",
    team: "True EDigital ekibi",
    why: (site: string) => `Bu e-postayı ${site} üzerindeki formu doldurduğunuz için aldınız.`,
  },
  en: {
    summaryTitle: "What you sent us",
    labels: { service: "Service", message: "Message", website: "Website", sector: "Industry", budget: "Monthly budget" },
    waTitle: "Don't want to wait?",
    waText: "If it's urgent, message us directly on WhatsApp — during business hours we reply within minutes.",
    waButton: "Message us on WhatsApp",
    waMessage: "Hello, I just filled in the form on your website.",
    readTitle: "Worth reading in the meantime",
    readMin: "min read",
    signoff: "Talk soon,",
    team: "The True EDigital team",
    why: (site: string) => `You are receiving this email because you filled in the form on ${site}.`,
  },
  de: {
    summaryTitle: "Ihre Angaben",
    labels: { service: "Leistung", message: "Nachricht", website: "Website", sector: "Branche", budget: "Monatliches Budget" },
    waTitle: "Sie möchten nicht warten?",
    waText: "Wenn es eilt, schreiben Sie uns direkt per WhatsApp – während der Geschäftszeiten antworten wir in wenigen Minuten.",
    waButton: "Per WhatsApp schreiben",
    waMessage: "Hallo, ich habe gerade das Formular auf Ihrer Website ausgefüllt.",
    readTitle: "Lesenswert in der Zwischenzeit",
    readMin: "Min. Lesezeit",
    signoff: "Bis bald,",
    team: "Ihr True-EDigital-Team",
    why: (site: string) => `Sie erhalten diese E-Mail, weil Sie das Formular auf ${site} ausgefüllt haben.`,
  },
  ru: {
    summaryTitle: "Что вы нам отправили",
    labels: { service: "Услуга", message: "Сообщение", website: "Сайт", sector: "Отрасль", budget: "Бюджет в месяц" },
    waTitle: "Не хотите ждать?",
    waText: "Если вопрос срочный, напишите нам в WhatsApp — в рабочее время мы отвечаем в течение нескольких минут.",
    waButton: "Написать в WhatsApp",
    waMessage: "Здравствуйте, я только что заполнил(а) форму на вашем сайте.",
    readTitle: "Что почитать, пока вы ждёте",
    readMin: "мин чтения",
    signoff: "До скорой связи,",
    team: "Команда True EDigital",
    why: (site: string) => `Вы получили это письмо, потому что заполнили форму на сайте ${site}.`,
  },
} as const;

const COPY: Record<Locale, LocaleCopy> = {
  tr: {
    contact: {
      ...shared.tr,
      subject: (n) => `Mesajınızı aldık, ${n} — True EDigital`,
      preheader: "Talebiniz bize ulaştı; en geç 48 saat içinde dönüş yapacağız.",
      hello: (n) => `Teşekkürler, ${n}!`,
      intro: () => "Mesajınız bize ulaştı. Talebinizi bizzat inceliyoruz ve en geç 48 saat içinde size dönüş yapacağız.",
      stepsTitle: "Bundan sonra ne olacak?",
      steps: [
        "Talebinizi ve mevcut dijital varlıklarınızı inceliyoruz.",
        "Hedeflerinize göre ilk yol haritasını çıkarıyoruz.",
        "Kısa bir görüşme için sizinle iletişime geçiyoruz.",
      ],
    },
    audit: {
      ...shared.tr,
      subject: () => "Ücretsiz dijital denetim talebiniz alındı — True EDigital",
      preheader: "Raporunuz en geç 3 iş günü içinde e-posta kutunuzda.",
      hello: (n) => `Teşekkürler, ${n}!`,
      intro: (w) => `${w ? `${w} için ` : ""}ücretsiz dijital denetim talebiniz bize ulaştı. Raporunuz en geç 3 iş günü içinde e-posta kutunuzda olacak — satış görüşmesi şartı yok.`,
      stepsTitle: "Raporda neler olacak?",
      steps: [
        "Sitenizin hız ve teknik SEO değerlendirmesi",
        "Reklam hesaplarınızda bütçenin nereden sızdığı",
        "İlk 90 gün için öncelikli aksiyon listesi",
      ],
    },
  },
  en: {
    contact: {
      ...shared.en,
      subject: (n) => `We got your message, ${n} — True EDigital`,
      preheader: "Your enquiry reached us; we'll get back to you within 48 hours.",
      hello: (n) => `Thank you, ${n}!`,
      intro: () => "Your message has reached us. We're reviewing your request personally and will get back to you within 48 hours.",
      stepsTitle: "What happens next?",
      steps: [
        "We review your request and your current digital assets.",
        "We sketch a first roadmap based on your goals.",
        "We reach out to schedule a short call.",
      ],
    },
    audit: {
      ...shared.en,
      subject: () => "Your free digital audit request is in — True EDigital",
      preheader: "Your report will be in your inbox within 3 business days.",
      hello: (n) => `Thank you, ${n}!`,
      intro: (w) => `We've received your free digital audit request${w ? ` for ${w}` : ""}. Your report will be in your inbox within 3 business days — no sales call required.`,
      stepsTitle: "What the report covers",
      steps: [
        "Speed and technical SEO review of your website",
        "Where budget is leaking in your ad accounts",
        "A prioritised action list for the first 90 days",
      ],
    },
  },
  de: {
    contact: {
      ...shared.de,
      subject: (n) => `Ihre Nachricht ist angekommen, ${n} – True EDigital`,
      preheader: "Ihre Anfrage ist bei uns; wir melden uns innerhalb von 48 Stunden.",
      hello: (n) => `Vielen Dank, ${n}!`,
      intro: () => "Ihre Nachricht ist bei uns angekommen. Wir prüfen Ihre Anfrage persönlich und melden uns innerhalb von 48 Stunden bei Ihnen.",
      stepsTitle: "Wie geht es weiter?",
      steps: [
        "Wir prüfen Ihre Anfrage und Ihre bestehenden digitalen Kanäle.",
        "Wir skizzieren eine erste Roadmap passend zu Ihren Zielen.",
        "Wir melden uns, um ein kurzes Gespräch zu vereinbaren.",
      ],
    },
    audit: {
      ...shared.de,
      subject: () => "Ihre Anfrage für den kostenlosen Digital-Audit ist da – True EDigital",
      preheader: "Ihr Bericht liegt innerhalb von 3 Werktagen in Ihrem Postfach.",
      hello: (n) => `Vielen Dank, ${n}!`,
      intro: (w) => `Wir haben Ihre Anfrage für den kostenlosen Digital-Audit${w ? ` für ${w}` : ""} erhalten. Ihr Bericht liegt innerhalb von 3 Werktagen in Ihrem Postfach – ganz ohne Verkaufsgespräch.`,
      stepsTitle: "Das erwartet Sie im Bericht",
      steps: [
        "Geschwindigkeit und technisches SEO Ihrer Website",
        "Wo in Ihren Werbekonten Budget versickert",
        "Eine priorisierte Maßnahmenliste für die ersten 90 Tage",
      ],
    },
  },
  ru: {
    contact: {
      ...shared.ru,
      subject: (n) => `Мы получили ваше сообщение, ${n} — True EDigital`,
      preheader: "Ваш запрос у нас; мы ответим в течение 48 часов.",
      hello: (n) => `Спасибо, ${n}!`,
      intro: () => "Ваше сообщение получено. Мы лично изучаем ваш запрос и свяжемся с вами в течение 48 часов.",
      stepsTitle: "Что будет дальше?",
      steps: [
        "Изучаем ваш запрос и текущие цифровые каналы.",
        "Готовим первую дорожную карту под ваши цели.",
        "Связываемся с вами, чтобы договориться о коротком звонке.",
      ],
    },
    audit: {
      ...shared.ru,
      subject: () => "Ваша заявка на бесплатный цифровой аудит принята — True EDigital",
      preheader: "Отчёт придёт на вашу почту в течение 3 рабочих дней.",
      hello: (n) => `Спасибо, ${n}!`,
      intro: (w) => `Мы получили вашу заявку на бесплатный цифровой аудит${w ? ` сайта ${w}` : ""}. Отчёт придёт на вашу почту в течение 3 рабочих дней — без обязательного звонка с продажами.`,
      stepsTitle: "Что будет в отчёте",
      steps: [
        "Оценка скорости и технического SEO вашего сайта",
        "Где утекает бюджет в ваших рекламных аккаунтах",
        "Приоритетный список действий на первые 90 дней",
      ],
    },
  },
};

// ── Yardımcılar ─────────────────────────────────────────────────────────────

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const firstName = (full: string) => full.trim().split(/\s+/)[0] || full;
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n).trimEnd() + "…" : s);
const waLink = (phone: string, text: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const C = {
  bg: "#0A0A0B",
  card: "#121218",
  line: "#24242E",
  text: "#E8E8EE",
  muted: "#9A9AAB",
  violet: "#7C5CFF",
  cyan: "#22D3EE",
  green: "#25D366",
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,Helvetica,Arial,sans-serif";

// ── Teşekkür e-postası ──────────────────────────────────────────────────────

export function buildThankYouEmail(opts: {
  locale: Locale;
  formType: FormType;
  name: string;
  service?: string | null;
  message?: string | null;
  payload?: AuditPayload | null;
  brand: EmailBrand;
  posts?: EmailPost[];
}): { subject: string; html: string; text: string } {
  const t = COPY[opts.locale][opts.formType];
  const name = firstName(opts.name);
  const website = opts.payload?.website?.trim() ?? "";
  const site = host(opts.brand.url);
  const logo = `${opts.brand.url.replace(/\/$/, "")}/email/logo.png`;
  const wa = waLink(opts.brand.phone, t.waMessage);
  const posts = (opts.posts ?? []).slice(0, 3);

  const rows: [string, string][] =
    opts.formType === "audit"
      ? [
          [t.labels.website, website],
          [t.labels.sector, opts.payload?.sector ?? ""],
          [t.labels.budget, opts.payload?.budget ?? ""],
        ]
      : [
          [t.labels.service, opts.service ?? ""],
          [t.labels.message, clip(opts.message ?? "", 280)],
        ];
  const summary = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 0;border-top:1px solid ${C.line};font:500 12px/1.5 ${FONT};color:${C.muted};text-transform:uppercase;letter-spacing:.08em;width:130px;vertical-align:top">${escapeHtml(k)}</td>
          <td style="padding:10px 0;border-top:1px solid ${C.line};font:400 14px/1.6 ${FONT};color:${C.text};white-space:pre-wrap">${escapeHtml(v)}</td>
        </tr>`,
    )
    .join("");

  const steps = t.steps
    .map(
      (s, i) => `
        <tr>
          <td style="padding:0 14px 14px 0;vertical-align:top;width:28px">
            <div style="width:28px;height:28px;border-radius:14px;background:${C.violet};background-image:linear-gradient(135deg,${C.violet},${C.cyan});color:#fff;font:700 13px/28px ${FONT};text-align:center">${i + 1}</div>
          </td>
          <td style="padding:4px 0 14px;font:400 15px/1.6 ${FONT};color:${C.text}">${escapeHtml(s)}</td>
        </tr>`,
    )
    .join("");

  const reading = posts.length
    ? `
      <tr><td style="padding:8px 40px 0">
        <p style="margin:0 0 12px;font:600 12px/1.5 ${FONT};color:${C.muted};text-transform:uppercase;letter-spacing:.14em">${escapeHtml(t.readTitle)}</p>
        ${posts
          .map(
            (p) => `
          <a href="${escapeHtml(p.url)}" style="display:block;text-decoration:none;padding:14px 16px;margin:0 0 8px;border:1px solid ${C.line};border-radius:12px;background:#16161E">
            <span style="display:block;font:600 15px/1.45 ${FONT};color:${C.text}">${escapeHtml(p.title)}</span>
            ${p.readingMin ? `<span style="display:block;margin-top:4px;font:400 12px/1.5 ${FONT};color:${C.muted}">${p.readingMin} ${escapeHtml(t.readMin)} →</span>` : ""}
          </a>`,
          )
          .join("")}
      </td></tr>`
    : "";

  const html = `<!doctype html>
<html lang="${opts.locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>${escapeHtml(t.subject(name))}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg}" bgcolor="${C.bg}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(t.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}" style="background:${C.bg}">
<tr><td align="center" style="padding:32px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">

    <tr><td style="padding:0 8px 24px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="padding-right:10px"><img src="${logo}" width="36" height="36" alt="" style="display:block;border:0;border-radius:9px"></td>
        <td style="font:600 18px/1 ${FONT};color:#fff;letter-spacing:-.01em">True <span style="color:${C.cyan}">EDigital</span></td>
      </tr></table>
    </td></tr>

    <tr><td bgcolor="${C.card}" style="background:${C.card};border:1px solid ${C.line};border-radius:20px;overflow:hidden">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td height="4" style="height:4px;line-height:4px;font-size:0;background:${C.violet};background-image:linear-gradient(90deg,${C.violet},${C.cyan})">&nbsp;</td></tr>

        <tr><td style="padding:40px 40px 8px">
          <h1 style="margin:0 0 16px;font:700 30px/1.2 ${FONT};color:#fff;letter-spacing:-.02em">${escapeHtml(t.hello(name))}</h1>
          <p style="margin:0;font:400 16px/1.65 ${FONT};color:${C.text}">${escapeHtml(t.intro(website))}</p>
        </td></tr>

        <tr><td style="padding:28px 40px 4px">
          <p style="margin:0 0 16px;font:600 12px/1.5 ${FONT};color:${C.muted};text-transform:uppercase;letter-spacing:.14em">${escapeHtml(t.stepsTitle)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${steps}</table>
        </td></tr>

        ${
          summary
            ? `<tr><td style="padding:12px 40px 8px">
          <p style="margin:0 0 4px;font:600 12px/1.5 ${FONT};color:${C.muted};text-transform:uppercase;letter-spacing:.14em">${escapeHtml(t.summaryTitle)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${summary}</table>
        </td></tr>`
            : ""
        }

        <tr><td style="padding:24px 40px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F1F17;border:1px solid #1E3A2B;border-radius:14px">
            <tr><td style="padding:20px 22px">
              <p style="margin:0 0 6px;font:600 16px/1.4 ${FONT};color:#fff">${escapeHtml(t.waTitle)}</p>
              <p style="margin:0 0 16px;font:400 14px/1.6 ${FONT};color:${C.muted}">${escapeHtml(t.waText)}</p>
              <a href="${wa}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:${C.green};color:#06240F;font:700 14px/1 ${FONT};text-decoration:none">${escapeHtml(t.waButton)}</a>
            </td></tr>
          </table>
        </td></tr>

        ${reading}

        <tr><td style="padding:28px 40px 40px">
          <p style="margin:0;font:400 15px/1.6 ${FONT};color:${C.text}">${escapeHtml(t.signoff)}<br><strong style="color:#fff">${escapeHtml(t.team)}</strong></p>
        </td></tr>
      </table>
    </td></tr>

    <tr><td align="center" style="padding:28px 16px 8px;font:400 13px/1.7 ${FONT};color:${C.muted}">
      <a href="${escapeHtml(opts.brand.url)}" style="color:${C.text};text-decoration:none">${escapeHtml(site)}</a>
      &nbsp;·&nbsp; <a href="mailto:${escapeHtml(opts.brand.email)}" style="color:${C.text};text-decoration:none">${escapeHtml(opts.brand.email)}</a>
      &nbsp;·&nbsp; <a href="tel:${opts.brand.phone.replace(/\s/g, "")}" style="color:${C.text};text-decoration:none">${escapeHtml(opts.brand.phone)}</a>
      ${opts.brand.instagram ? `<br><a href="${escapeHtml(opts.brand.instagram)}" style="color:${C.muted}">Instagram</a>` : ""}
    </td></tr>
    <tr><td align="center" style="padding:0 16px 24px;font:400 12px/1.6 ${FONT};color:#5F5F70">
      ${escapeHtml(t.why(site))}
    </td></tr>

  </table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    t.hello(name),
    "",
    t.intro(website),
    "",
    `${t.stepsTitle}`,
    ...t.steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    `${t.waTitle} ${t.waText}`,
    wa,
    ...(posts.length ? ["", t.readTitle, ...posts.map((p) => `- ${p.title}: ${p.url}`)] : []),
    "",
    t.signoff,
    t.team,
    "",
    `${site} · ${opts.brand.email} · ${opts.brand.phone}`,
  ].join("\n");

  return { subject: t.subject(name), html, text };
}

// ── Ajansa bildirim (Türkçe) ────────────────────────────────────────────────

const LOCALE_NAMES: Record<string, string> = {
  tr: "🇹🇷 Türkçe",
  en: "🇬🇧 İngilizce",
  de: "🇩🇪 Almanca",
  ru: "🇷🇺 Rusça",
};

export function buildAdminNotification(opts: {
  formType: FormType;
  locale: string;
  name: string;
  email: string;
  phone?: string | null;
  service?: string | null;
  message: string;
  payload?: AuditPayload | null;
  adminUrl: string;
  /** Müşteriye teşekkür e-postası gerçekten gitti mi — bildirimin altında yazar. */
  customerEmailSent: boolean;
}): { subject: string; html: string } {
  const audit = opts.formType === "audit";
  const p = opts.payload ?? {};
  const rows: [string, string][] = [
    ["Ad", opts.name],
    ["E-posta", opts.email],
    ["Telefon", opts.phone ?? ""],
    ["Dil", LOCALE_NAMES[opts.locale] ?? opts.locale],
    ...(audit
      ? ([
          ["Web sitesi", p.website ?? ""],
          ["Sektör", p.sector ?? ""],
          ["Kanallar", (p.channels ?? []).join(", ")],
          ["Bütçe", p.budget ?? ""],
          ["Hedef", p.goal ?? ""],
        ] as [string, string][])
      : ([["Hizmet", opts.service ?? ""]] as [string, string][])),
  ];
  const table = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#6b6b7b;font:500 13px/1.5 ${FONT};vertical-align:top;width:110px">${k}</td><td style="padding:8px 0;color:#111;font:400 14px/1.6 ${FONT};white-space:pre-wrap">${k === "E-posta" ? `<a href="mailto:${escapeHtml(v)}" style="color:#5B3FE0">${escapeHtml(v)}</a>` : escapeHtml(v)}</td></tr>`,
    )
    .join("");
  const phoneDigits = (opts.phone ?? "").replace(/\D/g, "");

  const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8"></head>
<body style="margin:0;background:#f4f4f7">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fff;border-radius:16px;border:1px solid #e6e6ec">
  <tr><td style="height:4px;font-size:0;line-height:4px;border-radius:16px 16px 0 0;background:#7C5CFF;background-image:linear-gradient(90deg,#7C5CFF,#22D3EE)">&nbsp;</td></tr>
  <tr><td style="padding:28px 32px 8px">
    <p style="margin:0 0 6px;font:600 12px/1.5 ${FONT};color:#7C5CFF;text-transform:uppercase;letter-spacing:.12em">${audit ? "Ücretsiz denetim talebi" : "Yeni iletişim formu"}</p>
    <h1 style="margin:0;font:700 22px/1.3 ${FONT};color:#111">${escapeHtml(opts.name)}${opts.service ? ` — ${escapeHtml(opts.service)}` : ""}</h1>
  </td></tr>
  <tr><td style="padding:12px 32px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table}</table></td></tr>
  ${audit ? "" : `<tr><td style="padding:4px 32px 8px"><div style="background:#f7f7fa;border-radius:10px;padding:16px;font:400 14px/1.65 ${FONT};color:#222;white-space:pre-wrap">${escapeHtml(opts.message)}</div></td></tr>`}
  <tr><td style="padding:16px 32px 28px">
    <a href="mailto:${escapeHtml(opts.email)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:999px;background:#111;color:#fff;font:600 13px/1 ${FONT};text-decoration:none">E-postayla yanıtla</a>
    ${phoneDigits ? `<a href="https://wa.me/${phoneDigits}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:999px;background:#25D366;color:#06240F;font:600 13px/1 ${FONT};text-decoration:none">WhatsApp</a>` : ""}
    <a href="${escapeHtml(opts.adminUrl)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 18px;border-radius:999px;border:1px solid #d9d9e3;color:#111;font:600 13px/1 ${FONT};text-decoration:none">Admin panelinde aç</a>
  </td></tr>
</table>
<p style="margin:16px 0 0;font:400 12px/1.5 ${FONT};color:#8a8a99">${opts.customerEmailSent ? "Müşteriye otomatik teşekkür e-postası gönderildi." : "Müşteriye teşekkür e-postası GÖNDERİLEMEDİ (Resend alan adı doğrulamasını kontrol edin)."}</p>
</td></tr></table>
</body></html>`;

  return {
    subject: audit
      ? `Ücretsiz denetim talebi: ${opts.name}${p.website ? ` — ${p.website}` : ""}`
      : `Yeni iletişim formu: ${opts.name}${opts.service ? ` — ${opts.service}` : ""}`,
    html,
  };
}
