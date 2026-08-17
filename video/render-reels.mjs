// 30 saniyelik Instagram Reels videolarını out/reels/ altına render eder.
// Kullanım: npm run render:reels   |   npm run render:reels ReelSeo
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const REELS = [
  ["ReelBuyumeOrtagi", "reel-1-buyume-ortagi"],
  ["ReelVakaRoas", "reel-2-vaka-roas"],
  ["ReelSeo", "reel-3-seo"],
  ["ReelHizmetler", "reel-4-hizmetler"],
  ["ReelSurec", "reel-5-surec"],
];

const filter = process.argv[2];
const jobs = filter ? REELS.filter(([id]) => id.toLowerCase().includes(filter.toLowerCase())) : REELS;

mkdirSync("out/reels", { recursive: true });
console.log(`\n${jobs.length} reel render edilecek (1080×1920, 30sn, 30fps).\n`);
for (const [id, file] of jobs) {
  console.log(`🎬  ${id} → out/reels/${file}.mp4`);
  // crf 18 = görsel olarak kayıpsıza yakın; yuv420p her oynatıcıda/Instagram'da çalışır.
  execSync(
    `npx remotion render src/index.ts ${id} out/reels/${file}.mp4 --codec=h264 --crf=18 --pixel-format=yuv420p --jpeg-quality=100`,
    { stdio: "inherit" },
  );
}
console.log(`\n✓  ${jobs.length} reel out/reels/ klasöründe.`);
