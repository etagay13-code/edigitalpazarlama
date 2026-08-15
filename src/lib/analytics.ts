// Ölçüm katmanı — GTM/GA4 kimliği girilmemiş olsa bile güvenle çağrılabilir.
//
// Olaylar dataLayer'a yazılır; GTM konteyneri bağlandığı anda hepsi otomatik
// akmaya başlar (kod değişikliği gerekmez). GTM yoksa push edilen olay sadece
// dizide birikir, hata vermez.
//
// GA4 tarafında dönüşüm olarak işaretlenmesi gerekenler: generate_lead,
// contact_click, whatsapp_click.

export type AnalyticsEvent =
  // Form gönderimi başarılı — asıl dönüşüm
  | { event: "generate_lead"; form: "contact" | "audit"; service?: string; locale: string }
  // Formu görüntüledi / doldurmaya başladı
  | { event: "form_start"; form: "contact" | "audit"; locale: string }
  // Telefon, e-posta, WhatsApp tıklaması
  | { event: "contact_click"; method: "phone" | "email" | "maps"; locale: string }
  | { event: "whatsapp_click"; locale: string }
  // CTA butonları — hangi bölümden tıklandığı
  | { event: "cta_click"; label: string; location: string; locale: string }
  // Hesaplayıcı kullanımı
  | { event: "calculator_use"; tool: "roas"; locale: string }
  // Blog etkileşimi
  | { event: "article_read"; slug: string; locale: string };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(payload: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ...payload });
}

/** Sayfadaki tüm tel:, mailto: ve WhatsApp bağlantılarını tek noktadan izler. */
export function trackLinkClick(href: string, locale: string): void {
  if (href.startsWith("tel:")) track({ event: "contact_click", method: "phone", locale });
  else if (href.startsWith("mailto:")) track({ event: "contact_click", method: "email", locale });
  else if (href.includes("wa.me") || href.includes("whatsapp")) track({ event: "whatsapp_click", locale });
  else if (href.includes("maps.google")) track({ event: "contact_click", method: "maps", locale });
}
