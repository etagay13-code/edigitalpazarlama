import { test, expect } from "@playwright/test";

test("iletişim formu render olur", async ({ page }) => {
  await page.goto("/iletisim");
  await expect(page.getByRole("textbox", { name: /Ad Soyad/i })).toBeVisible();
  await expect(page.getByRole("textbox", { name: /E-posta/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Mesajı Gönder/i })).toBeVisible();
});

test("dil seçici navbar'da görünür", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /Dil|Language/i })).toBeVisible();
});

test("hizmet detayı açılır", async ({ page }) => {
  await page.goto("/hizmetler/seo");
  await expect(page).toHaveURL(/\/hizmetler\/seo$/);
  await expect(page.locator("h1").first()).toBeVisible();
});

test("admin auth korumalı: /admin → login'e yönlenir", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
});

test("geçersiz locale 404", async ({ page }) => {
  const res = await page.goto("/fr");
  expect(res?.status()).toBe(404);
});
