// Tüm videoları out/ klasörüne render eder. Kullanım: npm run render:all
import { execSync } from "node:child_process";

const jobs = [
  ["BrandIntro-Dikey", "marka-tanitim-9x16"],
  ["BrandIntro-Kare", "marka-tanitim-1x1"],
  ["Services-Dikey", "hizmetler-9x16"],
  ["Services-Kare", "hizmetler-1x1"],
  ["CTA-Dikey", "teklif-al-9x16"],
  ["CTA-Kare", "teklif-al-1x1"],
];

for (const [id, name] of jobs) {
  console.log(`\n🎬  Rendering ${id} → out/${name}.mp4`);
  execSync(`npx remotion render src/index.ts ${id} out/${name}.mp4`, {
    stdio: "inherit",
  });
}
console.log("\n✓  Tüm videolar out/ klasöründe.");
