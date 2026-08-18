import Image from "next/image";
import type { Dict } from "@/i18n/dictionaries";

// Hero altındaki güven bandı — gerçek müşteri logoları (DB'deki marka
// listesinden sürülür).
//
// Logolar tek renk beyaz silüete indirgenir. Sebebi estetik değil pratik:
// on üç markanın logosu farklı renk, farklı zemin ve farklı optik ağırlıkta;
// doğal hâlleriyle yan yana dizildiklerinde bant bir logo çöplüğüne dönüşüyor.
// Silüet hepsini aynı dile çevirir, hover'da biraz aydınlanır.
//
// Logosu temiz biçimde elde edilemeyen marka (dokulu zeminden ayrıştırılamayan
// köşkeroğlu gibi) kelime-logo olarak yazıyla çıkar — eksik görünmez, kasıtlı
// bir tipografik varyasyon gibi durur.

const LOGOLAR: Record<string, { dosya: string; en: number; boy: number }> = {
  "istanbul care": { dosya: "istanbul-care", en: 120, boy: 120 },
  myhaar: { dosya: "myhaar", en: 127, boy: 120 },
  estemoon: { dosya: "estemoon", en: 117, boy: 120 },
  "mitsubishi klima": { dosya: "mitsubishi-klima", en: 139, boy: 120 },
  vibratech: { dosya: "vibratech", en: 460, boy: 86 },
  "bilen tesisat": { dosya: "bilen-tesisat", en: 450, boy: 120 },
  "karagoz hukuk": { dosya: "karagoz-hukuk", en: 113, boy: 120 },
  "neco nakliyat": { dosya: "neco-nakliyat", en: 314, boy: 120 },
  "oz bayrampasa": { dosya: "oz-bayrampasa", en: 460, boy: 98 },
  hri: { dosya: "hri", en: 460, boy: 108 },
  "ihh belgium": { dosya: "ihh-belgium", en: 460, boy: 119 },
  "iha austria": { dosya: "iha-austria", en: 294, boy: 120 },
};

// Şeritte hepsi aynı optik ağırlıkta dursun diye boy, logonun en/boy oranına
// göre verilir. Sabit yükseklikte kare bir amblem geniş bir kelime-logonun
// yanında gözle küçük kalıyor; geniş olan ise devleşiyor.
function boyClass(en: number, boy: number): string {
  const oran = en / boy;
  if (oran <= 1.3) return "h-11";
  if (oran <= 3) return "h-9";
  return "h-7";
}

// Marka adını eşleme anahtarına indirger: Türkçe harfler karşılığına iner,
// noktalama düşer. "KÖŞKEROĞLU" → "koskeroglu", "ÖZ BAYRAMPAŞA" → "oz bayrampasa".
function anahtar(ad: string): string {
  return ad
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const DEFAULT_BRANDS = ["ISTANBUL CARE", "MYHAAR", "ESTEMOON", "MITSUBISHI KLİMA"];

export function BrandStrip({
  label,
  brands,
  dict,
}: {
  label?: string | null;
  brands?: string[] | null;
  dict: Dict["brandStrip"];
}) {
  const list = brands && brands.length > 0 ? brands : DEFAULT_BRANDS;
  const heading = label && label.trim() ? label : dict.label;

  return (
    <section className="relative border-y border-white/[0.05] bg-ink-900/50 py-10">
      <div className="container-x">
        <p className="mb-7 text-center text-xs font-medium uppercase tracking-[0.32em] text-white/40">
          {heading}
        </p>
        <div className="group relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-16 whitespace-nowrap">
            {[...list, ...list].map((b, i) => {
              const logo = LOGOLAR[anahtar(b)];
              // İkinci kopya ekran okuyucuya tekrar okunmasın (sonsuz şerit
              // için görsel olarak iki kez basılıyor).
              const kopya = i >= list.length;
              if (!logo) {
                return (
                  <span
                    key={`${b}-${i}`}
                    aria-hidden={kopya}
                    className="font-display text-lg font-semibold tracking-[0.2em] text-white/[0.28] transition duration-500 group-hover:text-white/45"
                  >
                    {b}
                  </span>
                );
              }
              return (
                <Image
                  key={`${b}-${i}`}
                  src={`/clients/${logo.dosya}.png`}
                  alt={kopya ? "" : b}
                  aria-hidden={kopya}
                  width={logo.en}
                  height={logo.boy}
                  className={`${boyClass(logo.en, logo.boy)} w-auto opacity-45 brightness-0 invert transition duration-500 group-hover:opacity-70`}
                  sizes="240px"
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
