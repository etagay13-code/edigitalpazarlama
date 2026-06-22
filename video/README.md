# True EDigital Marketing — Sosyal Medya Videoları

Remotion ile üretilen 10 saniyelik tanıtım videoları. Sitenin renk (violet/cyan),
font (Space Grotesk / Inter) ve içeriğiyle birebir.

## Videolar (`out/` klasörü)

| Konsept | Dikey 9:16 (Reels/TikTok/Shorts) | Kare 1:1 (Feed) |
|---|---|---|
| Marka tanıtım | `marka-tanitim-9x16.mp4` | `marka-tanitim-1x1.mp4` |
| Hizmetler vitrini | `hizmetler-9x16.mp4` | `hizmetler-1x1.mp4` |
| Teklif al (CTA) | `teklif-al-9x16.mp4` | `teklif-al-1x1.mp4` |

Hepsi 1080p, 30fps, 10 saniye, sessiz (müziği sen ekleyeceksin).

## Komutlar

```bash
cd video
npm install            # bir kerelik
npm run studio         # tarayıcıda canlı önizleme + düzenleme
npm run render:all     # tüm videoları out/ klasörüne render et
```

Tek bir videoyu render: `npx remotion render src/index.ts CTA-Dikey out/x.mp4`

## Düzenleme
- Metinler/renkler/hizmet listesi: `src/brand.ts`
- Animasyonlar: `src/compositions/*.tsx`
- Yeni format/konsept: `src/Root.tsx`
