import { readFileSync } from "node:fs";
const tr=JSON.parse(readFileSync("scripts/i18n/tr.json","utf-8"));
const loc=process.argv[2];
const t=JSON.parse(readFileSync(`scripts/i18n/${loc}.json`,"utf-8"));
let ok=true;
for(const k of Object.keys(tr)){
  if(Array.isArray(tr[k])){
    const a=tr[k].length, b=Array.isArray(t[k])?t[k].length:-1;
    if(a!==b){ok=false; console.log(`✗ ${k}: tr ${a} vs ${loc} ${b}`);}
  }
}
console.log(ok?`✓ ${loc} yapı eşleşiyor`:`✗ ${loc} UYUŞMAZLIK`);
process.exit(ok?0:1);
