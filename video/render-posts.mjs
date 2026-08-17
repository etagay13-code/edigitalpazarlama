// Instagram feed postlarını (1080×1350) PNG olarak out/posts/ altına render eder.
// Kullanım: npm run render:posts   |   npm run render:posts PostRoas
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const { POSTS } = await import("./src/posts/post-data.ts").catch(() => ({ POSTS: null }));

// .ts doğrudan import edilemezse listeyi burada tut (tek doğruluk kaynağı yine post-data.ts).
const FALLBACK = [
  ["PostRoas", "01-roas-nedir"],
  ["PostMetrikler", "02-5-metrik"],
  ["PostAdsHata", "03-google-ads-hatalari"],
  ["PostSeo90", "04-seo-90-gun"],
  ["PostVaka", "05-vaka-roas"],
  ["PostKreatif", "06-kreatif-testi"],
  ["PostCro", "07-donusum-checklist"],
  ["PostNedenBiz", "08-neden-biz"],
  ["PostHizmetler", "09-hizmetler"],
  ["PostTeklif", "10-teklif-al"],
];

const list = POSTS ? POSTS.map((p) => [p.id, p.file]) : FALLBACK;
const filter = process.argv[2];
const jobs = filter ? list.filter(([id]) => id.toLowerCase().includes(filter.toLowerCase())) : list;

mkdirSync("out/posts", { recursive: true });
console.log(`\n${jobs.length} post render edilecek (1080×1350).\n`);
for (const [id, file] of jobs) {
  console.log(`🖼   ${id} → out/posts/${file}.png`);
  execSync(
    `npx remotion still src/index.ts ${id} out/posts/${file}.png --frame=120 --image-format=png`,
    { stdio: "inherit" },
  );
}
console.log(`\n✓  ${jobs.length} post out/posts/ klasöründe.`);
