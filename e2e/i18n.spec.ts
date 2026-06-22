import { test, expect } from "@playwright/test";

test.describe("i18n routing", () => {
  test("TR ana sayfa öneksiz açılır ve lang=tr", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");
    await expect(page.getByRole("link", { name: /Anasayfa/i }).first()).toBeVisible();
  });

  test("EN yerelleştirilmiş yol (/en/services) çalışır, lang=en", async ({ page }) => {
    await page.goto("/en/services");
    await expect(page).toHaveURL(/\/en\/services$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("link", { name: "Services", exact: true }).first()).toBeVisible();
  });

  test("DE yerelleştirilmiş yol (/de/leistungen) çalışır, lang=de", async ({ page }) => {
    await page.goto("/de/leistungen");
    await expect(page).toHaveURL(/\/de\/leistungen$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "de");
  });

  test("hreflang alternatifleri head'de var", async ({ page }) => {
    await page.goto("/en/services");
    const langs = await page.locator('link[rel="alternate"][hreflang]').count();
    expect(langs).toBeGreaterThanOrEqual(3);
  });

  test("/tr öneki kanonik öneksiz forma yönlenir", async ({ page }) => {
    await page.goto("/tr/hizmetler");
    await expect(page).toHaveURL(/\/hizmetler$/);
  });
});

test.describe("geo varsayılanı", () => {
  test("TR dışı ülke → ana sayfa İngilizce'ye yönlenir", async ({ browser }) => {
    const ctx = await browser.newContext({
      extraHTTPHeaders: { "x-vercel-ip-country": "US" },
    });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
    await ctx.close();
  });

  test("TR ülkesi → ana sayfa Türkçe kalır", async ({ browser }) => {
    const ctx = await browser.newContext({
      extraHTTPHeaders: { "x-vercel-ip-country": "TR" },
    });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/localhost:3000\/$/);
    await ctx.close();
  });
});
