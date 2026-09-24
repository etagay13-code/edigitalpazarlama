// Çerez / izleme onayı — TDDDG § 25, GDPR ve KVKK gereği analiz araçları ve
// üçüncü taraf gömüler (Google Maps) yalnızca ziyaretçinin onayından sonra
// yüklenir. Karar tarayıcıda saklanır; sürüm değişirse banner yeniden sorar.

export type Consent = { v: number; stats: boolean; media: boolean; ts: number };

const KEY = "edm.consent";
const VERSION = 1;
export const CONSENT_CHANGE = "edm:consent-change";
export const CONSENT_OPEN = "edm:consent-open";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    return c.v === VERSION ? c : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: { stats: boolean; media: boolean }) {
  const prev = readConsent();
  const c: Consent = { v: VERSION, ...choice, ts: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    /* özel sekmede localStorage kapalı olabilir — karar bu sayfa için geçerli kalır */
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_CHANGE, { detail: c }));
  // Onay geri alındıysa yüklenmiş analiz betiği sayfadan sökülemez:
  // çerezlerini sil ve sayfayı yenile.
  if (prev?.stats && !c.stats) {
    // Önce Google etiketini durdur; yoksa sayfa kapanırken son bir ölçüm
    // gönderip silinen çerezi yeniden yazıyor.
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("consent", "update", { analytics_storage: "denied" });
    for (const name of document.cookie.split(";").map((x) => x.split("=")[0].trim())) {
      if (/^(_ga|_gid|_gat|_clck|_clsk|_hj)/.test(name)) {
        const host = location.hostname.replace(/^www\./, "");
        for (const domain of ["", `; domain=.${host}`, `; domain=${location.hostname}`]) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
        }
      }
    }
    location.reload();
  }
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(CONSENT_OPEN));
}
