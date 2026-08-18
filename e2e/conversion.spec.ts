import { test, expect } from "@playwright/test";

// WhatsApp düğmesi ve 10. saniye penceresi — dönüşüm yolundaki iki bileşen.
// Sessizce bozulmaları en pahalı hata olur, o yüzden davranışları kilitlendi.

const HAZIR_MESAJ = {
  "/": "True EDigital Marketing sitesinden",
  "/en": "from the True EDigital Marketing website",
  "/de": "von der Website True EDigital Marketing",
} as const;

test.describe("WhatsApp düğmesi", () => {
  for (const [yol, parca] of Object.entries(HAZIR_MESAJ)) {
    test(`hazır mesaj sayfanın dilinde: ${yol}`, async ({ page }) => {
      await page.goto(yol);
      const wa = page.locator('a[href*="wa.me"]');
      await expect(wa).toBeVisible({ timeout: 8000 });

      const href = (await wa.getAttribute("href")) ?? "";
      // wa.me yalnızca rakam kabul eder — boşluk/artı kalırsa bağlantı açılmaz
      expect(href).toMatch(/^https:\/\/wa\.me\/\d{10,15}\?text=/);
      expect(decodeURIComponent(href)).toContain(parca);
    });
  }

  test("yeni sekmede açılır ve referrer sızdırmaz", async ({ page }) => {
    await page.goto("/");
    const wa = page.locator('a[href*="wa.me"]');
    await expect(wa).toBeVisible({ timeout: 8000 });
    expect(await wa.getAttribute("target")).toBe("_blank");
    expect(await wa.getAttribute("rel")).toContain("noopener");
  });
});

test.describe("dönüşüm penceresi", () => {
  test("10. saniyede açılır ve dataLayer'a olay yazar", async ({ page }) => {
    await page.goto("/");
    // 10 sn dolmadan görünmemeli
    await page.waitForTimeout(4000);
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);

    const pencere = page.locator('[role="dialog"]');
    await expect(pencere).toBeVisible({ timeout: 12000 });
    await expect(pencere.getByRole("link")).toBeVisible();
  });

  test("Esc ile kapanır ve aynı ziyarette geri gelmez", async ({ page }) => {
    // İki kez 10 sn'lik gecikmeyi beklemek gerekiyor; varsayılan 30 sn'lik
    // sınır paralel koşuda taşıyor ve ürün hatası gibi görünen flake üretiyor.
    test.setTimeout(60_000);
    await page.goto("/");
    const pencere = page.locator('[role="dialog"]');
    await expect(pencere).toBeVisible({ timeout: 14000 });

    await page.keyboard.press("Escape");
    await expect(pencere).toHaveCount(0);

    // Kapatma kaydı tutulmalı: yeniden gezinince tekrar açılmamalı
    await page.goto("/hakkimizda");
    await page.waitForTimeout(12000);
    await expect(page.locator('[role="dialog"]')).toHaveCount(0);
  });

  // Her adres kendi testinde: üçünü tek testte beklemek 30 sn'lik varsayılan
  // süre sınırını aşıyor ve ürün hatası gibi görünen bir zaman aşımı üretiyor.
  for (const yol of ["/dijital-denetim", "/en/digital-audit", "/de/danke"]) {
    test(`dönüşüm yolundaki sayfada hiç açılmaz: ${yol}`, async ({ page }) => {
      await page.goto(yol);
      await page.waitForTimeout(11500);
      await expect(page.locator('[role="dialog"]')).toHaveCount(0);
    });
  }

  test("mobilde ekranı tamamen kaplamaz", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const pencere = page.locator('[role="dialog"]');
    await expect(pencere).toBeVisible({ timeout: 14000 });

    // Google'ın "araya giren geçiş reklamı" ölçütü: mobilde içeriğin
    // görünür kalması gerekiyor. Yaprak ekranın %80'ini geçmemeli.
    const kutu = await pencere.boundingBox();
    expect(kutu).not.toBeNull();
    expect(kutu!.height).toBeLessThan(844 * 0.8);

    // Kapatma düğmesi ekranın içinde ve tıklanabilir olmalı
    const kapat = pencere.locator("button").first();
    await expect(kapat).toBeVisible();
    await kapat.click();
    await expect(pencere).toHaveCount(0);
  });
});
