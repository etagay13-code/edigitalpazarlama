# E - Digital Marketing

> A'dan Z'ye dijital büyüme ortağınız. Emre Tagay & ekibi için modern, koyu temalı, animasyonlu kurumsal ajans web sitesi.

## Tech Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (custom theme, glassmorphism, gradient effects)
- **Framer Motion** (scroll reveal, hero animations, page transitions)
- **lucide-react** (icon system)
- Responsive (mobile-first), accessible (a11y), SEO-ready (metadata, Open Graph, sitemap, robots, semantic HTML)

## Çalıştırma

```bash
# 1. Bağımlılıkları kur
npm install

# 2. Geliştirme sunucusunu başlat
npm run dev
# → http://localhost:3000

# 3. Production build
npm run build
npm start
```

## Proje Yapısı

```
e-digital-marketing/
├── public/
│   ├── logo.svg          ← Marka logosu (kendinizinkiyle değiştirin)
│   └── favicon.svg
├── src/
│   ├── app/              ← Next.js App Router (her sayfa ayrı klasör)
│   │   ├── layout.tsx    ← Global layout, fontlar, metadata
│   │   ├── globals.css   ← Tailwind + tema CSS
│   │   ├── page.tsx      ← Anasayfa
│   │   ├── not-found.tsx ← 404 sayfası
│   │   ├── sitemap.ts    ← SEO sitemap
│   │   ├── robots.ts     ← robots.txt
│   │   ├── hakkimizda/
│   │   ├── hizmetler/
│   │   ├── portfolyo/
│   │   └── iletisim/
│   ├── components/       ← Yeniden kullanılabilir bileşenler
│   │   ├── Navbar.tsx, Footer.tsx
│   │   ├── Hero.tsx, Stats.tsx, Process.tsx, FAQ.tsx, ...
│   │   ├── ContactForm.tsx (validation'lı)
│   │   ├── PortfolioGrid.tsx (filtreli)
│   │   └── Reveal.tsx, Counter.tsx, ...
│   └── lib/              ← İçerik & marka konfigürasyonu
│       ├── theme.ts      ← Marka bilgileri, renkler, sosyal medya (TEK NOKTA!)
│       ├── services.ts   ← Hizmet listesi
│       ├── projects.ts   ← Portfolyo projeleri
│       ├── testimonials.ts ← Müşteri yorumları
│       ├── faq.ts        ← Sık sorulanlar
│       └── navigation.ts ← Menü linkleri
├── tailwind.config.ts    ← Tema renkleri, animasyon keyframe'leri
└── package.json
```

## Kişiselleştirme

### 1. Marka bilgilerini değiştir
Tüm marka ayarları **tek bir dosyada**:

```ts
// src/lib/theme.ts
export const brand = {
  name: "E - Digital Marketing",
  founder: "Emre Tagay",
  email: "info@edigitalmarketing.com",
  phone: "+90 555 000 00 00",
  socials: { instagram: "...", linkedin: "...", ... },
  // ...
};
```

### 2. Logo'yu değiştir
- Logonuzu `/public/logo.svg` (veya .png) olarak kaydedin
- Gerekirse `src/components/Logo.tsx` içindeki `LOGO_SRC` değişkenini güncelleyin

### 3. Renkleri değiştir
- `tailwind.config.ts` → `colors.accent` / `colors.ink` blokları
- `src/app/globals.css` → `.gradient-text`, `.btn-primary` gradient'ları

### 4. İçerikleri düzenle
- Hizmetler: `src/lib/services.ts`
- Projeler: `src/lib/projects.ts`
- Yorumlar: `src/lib/testimonials.ts`
- SSS: `src/lib/faq.ts`

### 5. İletişim formunu bağla
`src/components/ContactForm.tsx` içindeki `onSubmit` fonksiyonu şu anda demo amaçlı simüle edilmiş. Gerçek bir gönderim için:
- Bir `/api/contact` route'u oluşturun (Resend, SendGrid, Postmark vb.)
- Veya Formspree/Web3Forms gibi bir form servisine POST atın

## Sayfalar

| Route | Sayfa |
|---|---|
| `/` | Anasayfa (Hero, hizmetler, istatistikler, süreç, yorumlar, SSS, CTA) |
| `/hakkimizda` | Kurucu hikayesi, misyon-vizyon, değerler, neden biz |
| `/hizmetler` | Tüm hizmetlerin detaylı açıklamaları |
| `/portfolyo` | Filtreli proje grid (Reklam / SEO / Mobil / SaaS / Web / Sosyal) |
| `/iletisim` | İletişim formu + kanallar + harita placeholder |
| `*` (404) | Özel 404 sayfası |

## Tasarım Notları

- **Tema:** Koyu (dark) varsayılan. `#0A0A0B` taban, mor-mavi-cyan gradient aksanlar.
- **Tipografi:** Space Grotesk (display) + Inter (body) — Google Fonts üzerinden, `next/font` ile self-hosted.
- **Animasyonlar:** Hero fade+slide, scroll reveal (Reveal/Stagger bileşenleri), counter sayaçları, navbar scroll daralma, mobil menü slide, FAQ accordion, testimonial fade transitions, portfolio filter layout animations.
- **Performans:** `next/image`, font display swap, lazy animations (whileInView), Tailwind purge.
- **A11y:** Skip link, ARIA labels, semantic HTML, focus-visible stilleri.
- **SEO:** Page metadata, Open Graph, Twitter Card, sitemap.xml, robots.txt, Turkish lang attribute.

## Çok dilli (i18n)

- Diller: **tr** (varsayılan, öneksiz), **en** (`/en/...`), **de** (`/de/...`).
- URL'ler yerelleştirilmiş: `/hizmetler` · `/en/services` · `/de/leistungen`.
- Coğrafi varsayılan (middleware): Türkiye → tr, diğer ülkeler → en. Seçim `NEXT_LOCALE` çerezinde tutulur.
- İçerik dil başına `locale` kolonuyla DB'de; admin'de üst bardaki bayraklı seçiciyle düzenlenir.
- Çeviri seed pipeline: `scripts/i18n/` (dump → `{en,de}.json` → `gen.mjs` ile DB'ye yazar).

## Chatbot (Claude)

- Sağ altta yüzen, sitenin içeriğiyle (hizmetler, SSS, sayfa bölümleri, ekip, marka) eğitilmiş AI asistan; 3 dilde, streaming yanıt.
- Bilgi tabanı `src/lib/chat/knowledge.ts` (DB'den, dile göre, cache'li) → `src/app/api/chat/route.ts` (Anthropic SDK, prompt-cache) → `src/components/ChatWidget.tsx`.
- **Gerekli env:** `ANTHROPIC_API_KEY` (lokalde `.env.local`, prod'da Vercel). Yoksa widget görünür ama yanıt vermez.
- Maliyet: varsayılan `claude-opus-4-8`. Ucuzlatmak için `CHAT_MODEL=claude-haiku-4-5`.

## Test

```bash
npm run test:e2e      # Playwright smoke testleri (i18n routing, geo, form, admin koruması)
```

## Canlıya alma (etruemarketing.com)

1. **Vercel → Settings → Domains:** `etruemarketing.com` + `www.etruemarketing.com` ekle.
2. **Registrar DNS:** `A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com` (Vercel'in gösterdiği değerler).
3. **Vercel → Environment Variables (Production):** Supabase anahtarları (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`). `NEXT_PUBLIC_SITE_URL` artık zorunlu değil (kod origin'i istekten türetiyor).
4. **Supabase → Authentication → URL Configuration:** Site URL + Redirect URLs'e `https://etruemarketing.com` ekle.
5. Domain doğrulanınca Vercel otomatik SSL verir.

## Lisans

© Emre Tagay / True EDigital Marketing. Tüm hakları saklıdır.
