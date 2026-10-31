// Impressum / Datenschutz / Künye metinleri (3 dil).
//
// Marka verileri (isim, e-posta, telefon) DB'deki site ayarlarından gelir;
// DB'de olmayan yasal bilgiler aşağıdaki LEGAL sabitindedir. Metinler sitede
// gerçekten kullanılan servisleri anlatır — yeni bir araç (ör. Meta Pixel,
// Hotjar) eklendiğinde buraya da bir bölüm eklenmelidir.
import type { Locale } from "@/i18n/config";

export const LEGAL = {
  // Ticari unvan (şahıs işletmesiyse ad soyad, şirketse tam unvan)
  entity: "Emre Tagay – True EDigital Marketing",
  owner: "Emre Tagay",
  // Tam posta adresi — Impressum için zorunlu
  street: "",
  city: "İstanbul",
  country: { tr: "Türkiye", en: "Türkiye", de: "Türkei", ru: "Турция" },
  // Vergi dairesi + vergi numarası (varsa)
  taxId: "",
  updated: "2026-09-24",
};

type Brand = { name: string; email: string; phone: string };

export type LegalSection = { h: string; p?: string[]; ul?: string[] };
export type LegalDoc = { title: string; description: string; updated: string; sections: LegalSection[] };

function addressLines(locale: Locale): string[] {
  return [LEGAL.entity, LEGAL.street, `${LEGAL.city}, ${LEGAL.country[locale]}`].filter(Boolean);
}

function fmtDate(locale: Locale): string {
  const d = new Date(LEGAL.updated + "T00:00:00Z");
  return d.toLocaleDateString(locale === "de" ? "de-DE" : locale === "en" ? "en-GB" : locale === "ru" ? "ru-RU" : "tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

const GOOGLE_IE = "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland";
const META_IE = "Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland";

// ─── Impressum ────────────────────────────────────────────────────────────

export function getImprint(locale: Locale, b: Brand): LegalDoc {
  const addr = addressLines(locale);
  const contact = [`E-Mail: ${b.email}`, `Tel.: ${b.phone}`];

  if (locale === "de") {
    return {
      title: "Impressum",
      description: `Anbieterkennzeichnung von ${b.name} gemäß § 5 DDG.`,
      updated: `Stand: ${fmtDate(locale)}`,
      sections: [
        { h: "Angaben gemäß § 5 DDG", p: addr },
        { h: "Kontakt", p: contact },
        ...(LEGAL.taxId ? [{ h: "Steuernummer", p: [LEGAL.taxId] }] : []),
        {
          h: "Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV",
          p: [LEGAL.owner, ...addr.slice(1)],
        },
        {
          h: "Verbraucherstreitbeilegung",
          p: [
            "Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Unsere Leistungen richten sich ausschließlich an Unternehmen.",
          ],
        },
        {
          h: "Haftung für Inhalte",
          p: [
            "Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte übernehmen wir jedoch keine Gewähr. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Sobald uns eine konkrete Rechtsverletzung bekannt wird, entfernen wir den betreffenden Inhalt umgehend.",
          ],
        },
        {
          h: "Haftung für Links",
          p: [
            "Unsere Website enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für diese fremden Inhalte ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Bei Bekanntwerden von Rechtsverletzungen entfernen wir derartige Links umgehend.",
          ],
        },
        {
          h: "Urheberrecht",
          p: [
            "Die auf dieser Website erstellten Inhalte und Werke unterliegen dem Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Genannte Marken und Logos von Kunden sind Eigentum der jeweiligen Inhaber.",
          ],
        },
      ],
    };
  }

  // Rusça yasal metin yok; RU sayfaları İngilizce metni gösterir.
  if (locale === "en" || locale === "ru") {
    return {
      title: "Imprint",
      description: `Legal notice and provider information for ${b.name}.`,
      updated: `Last updated: ${fmtDate(locale)}`,
      sections: [
        { h: "Service provider", p: addr },
        { h: "Contact", p: contact.map((c) => c.replace("Tel.", "Phone")) },
        ...(LEGAL.taxId ? [{ h: "Tax number", p: [LEGAL.taxId] }] : []),
        { h: "Responsible for content", p: [LEGAL.owner, ...addr.slice(1)] },
        {
          h: "Consumer dispute resolution",
          p: [
            "We are neither willing nor obliged to take part in dispute resolution proceedings before a consumer arbitration board. Our services are aimed exclusively at businesses.",
          ],
        },
        {
          h: "Liability for content",
          p: [
            "The content of this website was created with great care. We cannot, however, guarantee that it is accurate, complete or up to date. As soon as we become aware of a specific legal violation, we will remove the content concerned without delay.",
          ],
        },
        {
          h: "Liability for links",
          p: [
            "This website contains links to external third-party websites whose content we have no control over. The respective provider or operator is always responsible for the content of linked pages. If we become aware of any legal violations, we will remove such links immediately.",
          ],
        },
        {
          h: "Copyright",
          p: [
            "The content and works on this website are subject to copyright. Any reproduction, editing, distribution or use beyond the limits of copyright law requires the written consent of the respective author. Client trademarks and logos shown remain the property of their respective owners.",
          ],
        },
      ],
    };
  }

  return {
    title: "Künye",
    description: `${b.name} hizmet sağlayıcı bilgileri.`,
    updated: `Son güncelleme: ${fmtDate(locale)}`,
    sections: [
      { h: "Hizmet sağlayıcı", p: addr },
      { h: "İletişim", p: [`E-posta: ${b.email}`, `Telefon: ${b.phone}`] },
      ...(LEGAL.taxId ? [{ h: "Vergi bilgileri", p: [LEGAL.taxId] }] : []),
      { h: "İçerikten sorumlu", p: [LEGAL.owner] },
      {
        h: "İçerik ve bağlantılar",
        p: [
          "Bu sitedeki içerikler özenle hazırlanmıştır; ancak doğruluğu, eksiksizliği ve güncelliği konusunda garanti verilmez. Sitede yer alan üçüncü taraf bağlantılarının içeriğinden ilgili site sahipleri sorumludur. Hukuka aykırı bir içerik bildirildiğinde derhal kaldırılır.",
        ],
      },
      {
        h: "Telif hakkı",
        p: [
          "Sitedeki içerik ve tasarımlar telif hakkıyla korunur; yazılı izin olmadan çoğaltılamaz ve kullanılamaz. Sitede adı geçen müşteri marka ve logoları sahiplerine aittir.",
        ],
      },
    ],
  };
}

// ─── Datenschutz / Privacy / Gizlilik ─────────────────────────────────────

export function getPrivacy(locale: Locale, b: Brand): LegalDoc {
  const addr = addressLines(locale);

  if (locale === "de") {
    return {
      title: "Datenschutzerklärung",
      description: `Informationen zur Verarbeitung personenbezogener Daten auf der Website von ${b.name}.`,
      updated: `Stand: ${fmtDate(locale)}`,
      sections: [
        {
          h: "1. Verantwortlicher",
          p: [
            "Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:",
            ...addr,
            `E-Mail: ${b.email} · Tel.: ${b.phone}`,
          ],
        },
        {
          h: "2. Allgemeines",
          p: [
            "Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website, zur Beantwortung Ihrer Anfragen und zur Erbringung unserer Leistungen erforderlich ist oder Sie eingewilligt haben. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. a (Einwilligung), lit. b (Vertrag bzw. vorvertragliche Maßnahmen) und lit. f DSGVO (berechtigtes Interesse).",
          ],
        },
        {
          h: "3. Hosting und Server-Logfiles",
          p: [
            "Diese Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf der Website werden technisch notwendige Daten verarbeitet, die Ihr Browser automatisch übermittelt: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL, Browsertyp und Betriebssystem. Diese Daten sind erforderlich, um die Website auszuliefern und ihre Sicherheit zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO). Sie werden nicht mit anderen Datenquellen zusammengeführt.",
            "Vercel ist unter dem EU-US Data Privacy Framework zertifiziert; ergänzend bestehen Standardvertragsklauseln der EU-Kommission.",
          ],
        },
        {
          h: "4. SSL-/TLS-Verschlüsselung",
          p: [
            "Diese Website nutzt aus Sicherheitsgründen eine SSL-/TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie am Schloss-Symbol und an „https://“ in der Adresszeile Ihres Browsers.",
          ],
        },
        {
          h: "5. Kontakt- und Audit-Formular, E-Mail und Telefon",
          p: [
            "Wenn Sie uns über das Kontaktformular oder das Formular für das kostenlose Digital-Audit schreiben, verarbeiten wir die von Ihnen angegebenen Daten (z. B. Name, E-Mail-Adresse, Telefonnummer, Website, Branche, Nachricht) sowie zur Missbrauchsabwehr Ihre IP-Adresse und den User-Agent Ihres Browsers.",
            "Die Anfragen werden in einer Datenbank bei Supabase Inc. (USA) gespeichert; die Benachrichtigung per E-Mail erfolgt über Resend Inc. (USA). Die Verarbeitung erfolgt auf Grundlage der Auftragsverarbeitungsverträge der Anbieter einschließlich der Standardvertragsklauseln der EU-Kommission.",
            "Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit einem Vertrag oder vorvertraglichen Maßnahmen zusammenhängt, andernfalls unser berechtigtes Interesse an der Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. f DSGVO). Gleiches gilt, wenn Sie uns per E-Mail oder Telefon kontaktieren.",
          ],
        },
        {
          h: "6. WhatsApp, Instagram und Facebook",
          p: [
            `Sie können uns über WhatsApp sowie per Direktnachricht auf Instagram oder Facebook kontaktieren. Anbieter dieser Dienste ist ${META_IE}. Wenn Sie diese Kanäle nutzen, verarbeitet Meta Ihre Daten nach eigenen Datenschutzbestimmungen; eine Übermittlung in die USA ist dabei möglich (Meta ist unter dem EU-US Data Privacy Framework zertifiziert).`,
            "Wir nutzen die Inhalte Ihrer Nachricht ausschließlich zur Beantwortung Ihrer Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO). Wenn Sie über eine Anzeige auf Instagram oder Facebook mit uns in Kontakt treten, erhalten wir von Meta nur die Informationen, die Sie uns in der Unterhaltung selbst mitteilen, sowie Ihren öffentlichen Profilnamen.",
          ],
        },
        {
          h: "7. Chat-Assistent",
          p: [
            "Der Chat-Assistent auf dieser Website beantwortet Fragen anhand vordefinierter Antworten direkt in Ihrem Browser. Ihre Eingaben werden dabei nicht an uns oder an Dritte übermittelt und nicht gespeichert.",
          ],
        },
        {
          h: "8. Cookies und lokale Speicherung",
          p: [
            "Technisch notwendige Informationen legen wir im lokalen Speicher Ihres Browsers ab, z. B. Ihre Cookie-Auswahl, ob Sie das Chat-Fenster bereits gesehen oder den Hinweis auf das kostenlose Audit geschlossen haben. Grundlage ist § 25 Abs. 2 TDDDG.",
            "Beim ersten Besuch fragen wir über ein Banner nach Ihrer Einwilligung. Statistik-Tools (Abschnitt 9) und externe Medien (Abschnitt 10) werden erst geladen, wenn Sie zustimmen (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Sie können Ihre Auswahl jederzeit über den Link „Cookie-Einstellungen“ am Seitenende ändern oder widerrufen.",
          ],
        },
        {
          h: "9. Google Tag Manager und Google Analytics 4",
          p: [
            `Wir nutzen den Google Tag Manager, um Analyse-Werkzeuge zu verwalten, sowie Google Analytics 4 zur statistischen Auswertung der Website-Nutzung. Anbieter ist ${GOOGLE_IE}.`,
            "Google Analytics verarbeitet u. a. aufgerufene Seiten, Verweildauer, ungefähren Standort, Geräte- und Browserinformationen sowie Interaktionen wie Klicks auf Kontakt-Buttons. IP-Adressen werden in der EU gekürzt. Eine Übermittlung in die USA ist möglich; Google ist unter dem EU-US Data Privacy Framework zertifiziert.",
            "Die Verarbeitung erfolgt nur mit Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Die Daten werden nach Ablauf der in Google Analytics eingestellten Aufbewahrungsfrist (höchstens 14 Monate) gelöscht.",
          ],
        },
        {
          h: "10. Google Maps",
          p: [
            `Auf unserer Kontaktseite binden wir eine Karte von Google Maps ein (${GOOGLE_IE}). Beim Laden der Karte wird Ihre IP-Adresse an Google übermittelt. Die Karte wird erst geladen, wenn Sie in der Kategorie „Externe Medien“ eingewilligt oder auf „Karte laden“ geklickt haben (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG).`,
          ],
        },
        {
          h: "11. Schriftarten",
          p: [
            "Die auf dieser Website verwendeten Schriftarten sind lokal auf unserem Server eingebunden. Beim Seitenaufruf wird keine Verbindung zu Servern von Google oder anderen Schriftanbietern hergestellt.",
          ],
        },
        {
          h: "12. Social-Media-Profile",
          p: [
            "Auf unserer Website verlinken wir auf unsere Profile bei Instagram, LinkedIn, X und YouTube. Es handelt sich um einfache Links; Daten werden erst übertragen, wenn Sie einen Link anklicken und die jeweilige Plattform besuchen.",
          ],
        },
        {
          h: "13. Übermittlung in Drittländer",
          p: [
            "Unser Unternehmen hat seinen Sitz in der Türkei. Die Verarbeitung Ihrer Daten unterliegt dennoch der DSGVO, soweit Sie sich in der EU oder im EWR befinden (Art. 3 Abs. 2 DSGVO). Übermittlungen an Dienstleister in den USA stützen wir auf das EU-US Data Privacy Framework bzw. auf Standardvertragsklauseln der EU-Kommission.",
          ],
        },
        {
          h: "14. Speicherdauer",
          p: [
            "Wir speichern personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist. Anfragen, aus denen kein Auftrag entsteht, löschen wir spätestens 24 Monate nach der letzten Kommunikation. Gesetzliche Aufbewahrungspflichten bleiben unberührt.",
          ],
        },
        {
          h: "15. Ihre Rechte",
          p: ["Sie haben im Rahmen der gesetzlichen Vorgaben jederzeit das Recht auf:"],
          ul: [
            "Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)",
            "Berichtigung unrichtiger Daten (Art. 16 DSGVO)",
            "Löschung (Art. 17 DSGVO)",
            "Einschränkung der Verarbeitung (Art. 18 DSGVO)",
            "Datenübertragbarkeit (Art. 20 DSGVO)",
            "Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)",
            "Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)",
          ],
        },
        {
          h: "16. Beschwerderecht",
          p: [
            `Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, insbesondere in dem Mitgliedstaat Ihres Wohnorts oder Arbeitsplatzes. Für Anfragen zum Datenschutz erreichen Sie uns jederzeit unter ${b.email}.`,
          ],
        },
        {
          h: "17. Änderungen",
          p: [
            "Wir passen diese Datenschutzerklärung an, sobald sich die Website oder die rechtlichen Anforderungen ändern. Es gilt die jeweils hier veröffentlichte Fassung.",
          ],
        },
      ],
    };
  }

  // Rusça yasal metin yok; RU sayfaları İngilizce metni gösterir.
  if (locale === "en" || locale === "ru") {
    const G = GOOGLE_IE.replace("Irland", "Ireland");
    const M = META_IE.replace("Irland", "Ireland");
    return {
      title: "Privacy Policy",
      description: `How ${b.name} processes personal data on this website.`,
      updated: `Last updated: ${fmtDate(locale)}`,
      sections: [
        {
          h: "1. Controller",
          p: [
            "The controller responsible for data processing on this website within the meaning of the General Data Protection Regulation (GDPR) is:",
            ...addr,
            `Email: ${b.email} · Phone: ${b.phone}`,
          ],
        },
        {
          h: "2. General",
          p: [
            "We process personal data only to the extent necessary to provide a functional website, answer your enquiries and deliver our services, or where you have given consent. The legal bases are in particular Art. 6(1)(a) (consent), (b) (contract or pre-contractual steps) and (f) GDPR (legitimate interests).",
          ],
        },
        {
          h: "3. Hosting and server log files",
          p: [
            "This website is hosted by Vercel Inc. (USA). When you visit the website, technically necessary data transmitted automatically by your browser is processed: IP address, date and time of access, page requested, referrer URL, browser type and operating system. This data is needed to deliver the website and keep it secure (Art. 6(1)(f) GDPR) and is not combined with other data sources.",
            "Vercel is certified under the EU-US Data Privacy Framework; EU Standard Contractual Clauses are also in place.",
          ],
        },
        {
          h: "4. SSL/TLS encryption",
          p: ["For security reasons this website uses SSL/TLS encryption, recognisable by the padlock icon and “https://” in your browser's address bar."],
        },
        {
          h: "5. Contact and audit forms, email and phone",
          p: [
            "When you contact us via the contact form or the free digital audit form, we process the data you provide (e.g. name, email address, phone number, website, industry, message) as well as your IP address and browser user agent to prevent abuse.",
            "Enquiries are stored in a database at Supabase Inc. (USA); email notifications are sent via Resend Inc. (USA). Processing is based on the providers' data processing agreements, including the European Commission's Standard Contractual Clauses.",
            "The legal basis is Art. 6(1)(b) GDPR where your enquiry relates to a contract or pre-contractual steps, otherwise our legitimate interest in handling your enquiry (Art. 6(1)(f) GDPR). The same applies when you contact us by email or phone.",
          ],
        },
        {
          h: "6. WhatsApp, Instagram and Facebook",
          p: [
            `You can contact us via WhatsApp and via direct message on Instagram or Facebook. These services are provided by ${M}. When you use these channels, Meta processes your data under its own privacy policy; transfers to the USA are possible (Meta is certified under the EU-US Data Privacy Framework).`,
            "We use the content of your messages solely to answer your enquiry (Art. 6(1)(b) or (f) GDPR). If you contact us through an ad on Instagram or Facebook, we only receive from Meta what you tell us in the conversation and your public profile name.",
          ],
        },
        {
          h: "7. Chat assistant",
          p: ["The chat assistant on this website answers questions from predefined responses directly in your browser. Your input is not sent to us or to any third party and is not stored."],
        },
        {
          h: "8. Cookies and local storage",
          p: [
            "We store technically necessary information in your browser's local storage, e.g. your cookie choice, whether you have already seen the chat window or closed the free-audit notice.",
            "On your first visit, a banner asks for your consent. Statistics tools (section 9) and external media (section 10) are only loaded once you agree (Art. 6(1)(a) GDPR). You can change or withdraw your choice at any time via the “Cookie settings” link at the bottom of the page.",
          ],
        },
        {
          h: "9. Google Tag Manager and Google Analytics 4",
          p: [
            `We use Google Tag Manager to manage analytics tools and Google Analytics 4 to analyse website usage statistically. The provider is ${G}.`,
            "Google Analytics processes, among other things, pages viewed, time on site, approximate location, device and browser information, and interactions such as clicks on contact buttons. IP addresses are truncated in the EU. Transfers to the USA are possible; Google is certified under the EU-US Data Privacy Framework.",
            "Processing takes place only with your consent (Art. 6(1)(a) GDPR). Data is deleted when the retention period set in Google Analytics expires (no more than 14 months).",
          ],
        },
        {
          h: "10. Google Maps",
          p: [`Our contact page embeds a Google Maps map (${G}). When the map loads, your IP address is transmitted to Google. The map only loads once you have consented to “External media” or clicked “Load map” (Art. 6(1)(a) GDPR).`],
        },
        {
          h: "11. Fonts",
          p: ["The fonts used on this website are hosted locally on our server. No connection to Google or other font providers is made when you visit a page."],
        },
        {
          h: "12. Social media profiles",
          p: ["We link to our profiles on Instagram, LinkedIn, X and YouTube. These are plain links; no data is transferred until you click a link and visit the platform."],
        },
        {
          h: "13. Transfers to third countries",
          p: [
            "Our business is based in Türkiye. Where you are located in the EU or EEA, processing of your data is nevertheless subject to the GDPR (Art. 3(2) GDPR). Transfers to service providers in the USA are based on the EU-US Data Privacy Framework or the European Commission's Standard Contractual Clauses.",
          ],
        },
        {
          h: "14. Retention",
          p: [
            "We keep personal data only for as long as necessary for the relevant purpose. Enquiries that do not lead to an engagement are deleted no later than 24 months after the last communication. Statutory retention obligations remain unaffected.",
          ],
        },
        {
          h: "15. Your rights",
          p: ["Within the limits of the law, you have the right at any time to:"],
          ul: [
            "access the data we hold about you (Art. 15 GDPR)",
            "have inaccurate data corrected (Art. 16 GDPR)",
            "erasure (Art. 17 GDPR)",
            "restriction of processing (Art. 18 GDPR)",
            "data portability (Art. 20 GDPR)",
            "object to processing based on legitimate interests (Art. 21 GDPR)",
            "withdraw consent with effect for the future (Art. 7(3) GDPR)",
          ],
        },
        {
          h: "16. Right to lodge a complaint",
          p: [`You have the right to lodge a complaint with a data protection supervisory authority, in particular in the member state of your residence or workplace. For any privacy questions, contact us at ${b.email}.`],
        },
        {
          h: "17. Changes",
          p: ["We update this privacy policy whenever the website or legal requirements change. The version published here applies."],
        },
      ],
    };
  }

  return {
    title: "Gizlilik Politikası",
    description: `${b.name} web sitesinde kişisel verilerin nasıl işlendiğine dair bilgilendirme.`,
    updated: `Son güncelleme: ${fmtDate(locale)}`,
    sections: [
      {
        h: "1. Veri sorumlusu",
        p: [
          "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve AB Genel Veri Koruma Tüzüğü (GDPR) kapsamında veri sorumlusu:",
          ...addr,
          `E-posta: ${b.email} · Telefon: ${b.phone}`,
        ],
      },
      {
        h: "2. Genel",
        p: [
          "Kişisel verilerinizi yalnızca sitenin çalışması, taleplerinizin yanıtlanması ve hizmetlerimizin sunulması için gerekli olduğu ölçüde ya da açık rızanız bulunduğunda işleriz.",
        ],
      },
      {
        h: "3. Barındırma ve sunucu kayıtları",
        p: [
          "Site Vercel Inc. (ABD) altyapısında barındırılır. Siteyi ziyaret ettiğinizde tarayıcınızın otomatik gönderdiği IP adresi, erişim zamanı, görüntülenen sayfa, yönlendiren adres, tarayıcı ve işletim sistemi bilgileri sitenin sunulması ve güvenliği için işlenir.",
        ],
      },
      {
        h: "4. İletişim ve denetim formları, e-posta ve telefon",
        p: [
          "İletişim veya ücretsiz dijital denetim formunu doldurduğunuzda ad, e-posta, telefon, web sitesi, sektör ve mesaj gibi bilgileriniz ile kötüye kullanımı önlemek için IP adresiniz ve tarayıcı bilginiz işlenir.",
          "Talepler Supabase Inc. (ABD) veritabanında saklanır; e-posta bildirimleri Resend Inc. (ABD) üzerinden gönderilir. Bu aktarımlar KVKK m. 9 ve GDPR'daki yurt dışı aktarım kurallarına uygun olarak yapılır.",
        ],
      },
      {
        h: "5. WhatsApp, Instagram ve Facebook",
        p: [
          "Bize WhatsApp ya da Instagram/Facebook mesajıyla ulaşabilirsiniz. Bu hizmetlerin sağlayıcısı Meta Platforms Ireland Limited'dir ve verileriniz Meta'nın kendi gizlilik politikasına göre işlenir. Mesaj içeriklerini yalnızca talebinizi yanıtlamak için kullanırız.",
        ],
      },
      {
        h: "6. Sohbet asistanı",
        p: ["Sitedeki sohbet asistanı önceden tanımlı cevaplarla doğrudan tarayıcınızda çalışır; yazdıklarınız bize veya üçüncü kişilere gönderilmez ve saklanmaz."],
      },
      {
        h: "7. Çerezler ve analiz",
        p: [
          "Çerez tercihiniz ve sohbet penceresini görüp görmediğiniz gibi teknik olarak gerekli bilgileri tarayıcınızın yerel depolamasında tutarız. İstatistik araçları ve harici medya yalnızca ilk ziyaretteki banner üzerinden verdiğiniz açık rızayla yüklenir; tercihinizi sayfanın altındaki “Çerez ayarları” bağlantısından istediğiniz zaman değiştirebilirsiniz.",
          "Site kullanımını istatistiksel olarak ölçmek için Google Tag Manager ve Google Analytics 4 (Google Ireland Limited) kullanırız. İletişim sayfasındaki harita, onay vermeniz veya “Haritayı yükle”ye tıklamanız hâlinde Google Maps üzerinden yüklenir ve bu sırada IP adresiniz Google'a iletilir. Yazı tipleri kendi sunucumuzdan yüklenir.",
        ],
      },
      {
        h: "8. Saklama süresi",
        p: ["Kişisel veriler, amaç için gerekli olan süre boyunca saklanır. İşe dönüşmeyen talepler son iletişimden en geç 24 ay sonra silinir; yasal saklama yükümlülükleri saklıdır."],
      },
      {
        h: "9. Haklarınız",
        p: ["KVKK m. 11 ve GDPR kapsamında aşağıdaki haklara sahipsiniz:"],
        ul: [
          "Kişisel verilerinizin işlenip işlenmediğini öğrenme ve bilgi talep etme",
          "Eksik veya yanlış işlenen verilerin düzeltilmesini isteme",
          "Verilerinizin silinmesini veya yok edilmesini isteme",
          "İşlemeye itiraz etme ve verdiğiniz rızayı geri alma",
          "Kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
        ],
      },
      {
        h: "10. Başvuru",
        p: [`Haklarınıza ilişkin taleplerinizi ${b.email} adresine iletebilirsiniz. Başvurular en geç 30 gün içinde yanıtlanır.`],
      },
    ],
  };
}
