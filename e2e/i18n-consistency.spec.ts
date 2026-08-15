import { test, expect, type Page } from "@playwright/test";

// Dil tutarlılığı testi: her sayfada, seçilen dil dışında bir dilden metin
// kalmadığını doğrular. Özel isimler (kişi/marka adları) hariç tutulur.

// Hizmet slug'ları dile göre yerelleştirilmiş (bkz. i18n/routes.ts SERVICE_SLUGS)
const SLUGS = {
  tr: [
    "360-dijital-pazarlama",
    "reklam-yonetimi",
    "seo",
    "mobil-uygulama-gelistirme",
    "saas-proje-gelistirme",
    "sosyal-medya-yonetimi",
    "web-tasarim-gelistirme",
    "icerik-marka-stratejisi",
  ],
  en: [
    "360-digital-marketing",
    "ad-management",
    "seo",
    "mobile-app-development",
    "saas-development",
    "social-media-management",
    "web-design-development",
    "content-brand-strategy",
  ],
  de: [
    "360-digitales-marketing",
    "anzeigenmanagement",
    "seo",
    "app-entwicklung",
    "saas-entwicklung",
    "social-media-management",
    "webdesign-entwicklung",
    "content-markenstrategie",
  ],
} as const;

const PATHS = {
  tr: ["/", "/hizmetler", "/hakkimizda", "/portfolyo", "/iletisim", ...SLUGS.tr.map((s) => `/hizmetler/${s}`)],
  en: ["/en", "/en/services", "/en/about", "/en/portfolio", "/en/contact", ...SLUGS.en.map((s) => `/en/services/${s}`)],
  de: ["/de", "/de/leistungen", "/de/ueber-uns", "/de/portfolio", "/de/kontakt", ...SLUGS.de.map((s) => `/de/leistungen/${s}`)],
} as const;

// Kişi/marka adlarında geçen Türkçe karakterler yanlış alarm üretmesin diye
// bunlar metinden temizlenir.
const PROPER_NOUNS = [
  "Emre Tagay", "İstanbul", "Istanbul", "Türkiye",
  // Gerçek müşteri markaları — özel isim oldukları için çevrilmez
  "Istanbul Care", "MyHaar", "Estemoon", "Vibratech",
  // Marka şeridindeki yazımı karışık büyük harfli ("MITSUBISHI" düz I,
  // "KLİMA" noktalı İ), bu yüzden tam hâli de listede.
  "Mitsubishi Klima", "MITSUBISHI KLİMA",
  "Köşkeroğlu", "Bilen Tesisat", "Karagöz", "Neco Nakliyat", "Öz Bayrampaşa",
  "IHH Belgium", "IHA Austria",
];

// Sadece Türkçede bulunan harfler + yalnızca Türkçe olabilecek kelimeler.
const TR_ONLY = /[ığşİĞŞ]|\b(için|değil|ancak|hizmetlerimiz|sayfasından|markanızı|bize|sizin|çalışma)\b/i;

async function visibleText(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  const body = (await page.locator("body").innerText()) ?? "";
  // Özel isimler metinden çıkarılır. Tüm metni küçük harfe çevirmek yerine
  // ismin harf varyantları tek tek silinir: Türkçe küçültme Almanca "Inhalt"ı
  // "ınhalt" yapıp yanlış alarm üretiyordu (noktasız ı Türkçe işareti sayılıyor).
  const variants = (n: string) => [
    n,
    n.toLocaleUpperCase("tr"),
    n.toLocaleUpperCase("en"),
    n.toLocaleLowerCase("tr"),
    n.toLocaleLowerCase("en"),
  ];
  return PROPER_NOUNS.flatMap(variants).reduce((acc, v) => acc.split(v).join(" "), body);
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
    { from: "/hizmetler/mobil-uygulama-gelistirme", to: /\/en\/services\/mobile-app-development$/, target: "en", expect: "Get a Quote for This Service" },
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

test.describe("çok dilli URL yapısı", () => {
  test("EN/DE hizmet adresleri yerelleştirilmiş slug kullanır", async ({ page }) => {
    await page.goto("/de/leistungen/app-entwicklung");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/de\/leistungen\/app-entwicklung$/,
    );
    const tr = page.locator('link[rel="alternate"][hreflang="tr"]');
    await expect(tr).toHaveAttribute("href", /\/hizmetler\/mobil-uygulama-gelistirme$/);
  });

  test("eski Türkçe slug'lı EN adresi 301 ile yenisine gider", async ({ page }) => {
    const res = await page.goto("/en/services/mobil-uygulama-gelistirme");
    expect(res?.status()).toBe(200);
    await expect(page).toHaveURL(/\/en\/services\/mobile-app-development$/);
  });
});

// Vercel, x-vercel-ip-country'yi kenarda kendisi set eder; dışarıdan gönderilen
// değeri yok sayar. Bu yüzden coğrafi testler sadece yerel sunucuda anlamlı.
test.describe("coğrafi yönlendirme", () => {
  test.skip(
    !!process.env.E2E_BASE_URL,
    "Uzak ortamda ülke başlığı taklit edilemez (Vercel kenarda üzerine yazar)",
  );

  test("Googlebot yönlendirilmez, Türkçe sayfa taranabilir", async ({ browser }) => {
    const ctx = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      extraHTTPHeaders: { "x-vercel-ip-country": "US" },
    });
    const page = await ctx.newPage();
    await page.goto("/hizmetler");
    await expect(page).toHaveURL(/\/hizmetler$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    await ctx.close();
  });

  test("Almanya'dan gelen kullanıcı Almanca sayfaya yönlenir", async ({ browser }) => {
    const ctx = await browser.newContext({
      extraHTTPHeaders: { "x-vercel-ip-country": "DE" },
    });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/de$/);
    await ctx.close();
  });
});
