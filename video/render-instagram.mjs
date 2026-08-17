// Instagram videolarını out/ klasörüne render eder (kare 1:1 + dikey 9:16).
// 2 genel tanıtım + 8 hizmet videosu = 10 konsept × 2 format = 20 dosya.
// Kullanım:
//   npm run render:ig            → hepsi
//   npm run render:ig hizmet     → sadece hizmet videoları
//   npm run render:ig HizmetSeo  → tek bir kompozisyon (id ile filtre)
import { execSync } from "node:child_process";

// [kompozisyon-id-tabanı, çıktı-adı]
const concepts = [
  ["Sonuclar", "sonuclar"],
  ["NedenBiz", "neden-biz"],
];

const services = [
  ["HizmetDijital360", "hizmet-360-dijital-pazarlama"],
  ["HizmetReklam", "hizmet-reklam-yonetimi"],
  ["HizmetSeo", "hizmet-seo"],
  ["HizmetMobil", "hizmet-mobil-uygulama"],
  ["HizmetSaas", "hizmet-saas-proje"],
  ["HizmetSosyal", "hizmet-sosyal-medya"],
  ["HizmetWeb", "hizmet-web-tasarim"],
  ["HizmetIcerik", "hizmet-icerik-marka"],
];

const filter = process.argv[2]; // opsiyonel
let base = [...concepts, ...services];
if (filter === "hizmet") base = services;
else if (filter) base = base.filter(([id]) => id.toLowerCase().includes(filter.toLowerCase()));

const formats = [
  ["Kare", "1x1"],
  ["Dikey", "9x16"],
];

const jobs = base.flatMap(([id, name]) =>
  formats.map(([label, suffix]) => [`${id}-${label}`, `${name}-${suffix}`]),
);

console.log(`\n${jobs.length} video render edilecek.\n`);
for (const [id, name] of jobs) {
  console.log(`🎬  ${id} → out/${name}.mp4`);
  execSync(`npx remotion render src/index.ts ${id} out/${name}.mp4`, { stdio: "inherit" });
}
console.log(`\n✓  ${jobs.length} video out/ klasöründe.`);
