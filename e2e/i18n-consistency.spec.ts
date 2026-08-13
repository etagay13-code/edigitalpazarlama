import { test, expect, type Page } from "@playwright/test";

// Dil tutarlılığı testi: her sayfada, seçilen dil dışında bir dilden metin
// kalmadığını doğrular. Özel isimler (kişi/marka adları) hariç tutulur.

const SLUGS = [
  "360-dijital-pazarlama",
  "reklam-yonetimi",
  "seo",
  "mobil-uygulama-gelistirme",
  "saas-proje-gelistirme",
  "sosyal-medya-yonetimi",
  "web-tasarim-gelistirme",
  "icerik-marka-stratejisi",
];

const PATHS = {
  tr: ["/", "/hizmetler", "/hakkimizda", "/portfolyo", "/iletisim", ...SLUGS.map((s) => `/hizmetler/${s}`)],
  en: ["/en", "/en/services", "/en/about", "/en/portfolio", "/en/contact", ...SLUGS.map((s) => `/en/services/${s}`)],
  de: ["/de", "/de/leistungen", "/de/ueber-uns", "/de/portfolio", "/de/kontakt", ...SLUGS.map((s) => `/de/leistungen/${s}`)],
} as const;

// Kişi/marka adlarında geçen Türkçe karakterler yanlış alarm üretmesin diye
// bunlar metinden temizlenir.
const PROPER_NOUNS = [
  "Deniz Aydın", "Zeynep Şahin", "Burak Yıldız", "Onur Şahin", "Kerem Doğan",
  "Beyza Yılmaz", "Emre Tagay", "İstanbul", "Istanbul", "Türkiye",
];

// Sadece Türkçede bulunan harfler + yalnızca Türkçe olabilecek kelimeler.
const TR_ONLY = /[ığşİĞŞ]|\b(için|değil|ancak|hizmetlerimiz|sayfasından|markanızı|bize|sizin|çalışma)\b/i;

async function visibleText(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const body = (await page.locator("body").innerText()) ?? "";
  return PROPER_NOUNS.reduce((acc, n) => acc.split(n).join(" "), body);
}

for (const locale of ["en", "de"] as const) {
  for (const path of PATHS[locale]) {
    test(`${locale.toUpperCase()} sayfasında Türkçe metin kalmıyor: ${path}`, async ({ page }) => {
      const text = await visibleText(page, path);
      const leaks = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 3 && TR_ONLY.test(l));
      expect(leaks, `Türkçe kalıntı: ${leaks.slice(0, 5).join(" | ")}`).toEqual([]);
    });
  }
}

test.describe("dil değiştirici", () => {
  const cases = [
    { from: "/hizmetler/seo", to: /\/en\/services\/seo$/, target: "en", expect: "Get a Quote for This Service" },
    { from: "/portfolyo", to: /\/de\/portfolio$/, target: "de", expect: "Alle" },
    { from: "/en/contact", to: /\/iletisim$/, target: "tr", expect: "Mesajı Gönder" },
  ];

  for (const c of cases) {
    test(`${c.from} → ${c.target} aynı sayfada kalır ve içerik çevrilir`, async ({ page }) => {
      await page.goto(c.from);
      await page.getByRole("button", { name: /Dil \/ Language/i }).click();
      await page.getByRole("button", { name: new RegExp(c.target === "tr" ? "Türkçe" : c.target === "en" ? "English" : "Deutsch") }).click();
      await expect(page).toHaveURL(c.to);
      await expect(page.getByText(c.expect).first()).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", c.target);
    });
  }

  test("dil seçimi sonraki sayfalarda korunur", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Dil \/ Language/i }).click();
    await page.getByRole("button", { name: /English/ }).click();
    await expect(page).toHaveURL(/\/en$/);
    await page.getByRole("link", { name: "Portfolio", exact: true }).first().click();
    await expect(page).toHaveURL(/\/en\/portfolio$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });
});

test.describe("404 sayfası", () => {
  for (const [path, marker, lang] of [
    ["/olmayan-sayfa", "Aradığınız sayfa bulunamadı", "tr"],
    ["/en/missing-page", "wasn't found", "en"],
    ["/de/fehlende-seite", "Die gesuchte Seite wurde nicht gefunden", "de"],
  ] as const) {
    test(`404 ${lang} dilinde`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(404);
      await expect(page.getByText(marker).first()).toBeVisible();
    });
  }
});
