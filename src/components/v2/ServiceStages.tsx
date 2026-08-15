"use client";

import { ServiceStage } from "./ServiceStage";
import { SeoScene } from "./scenes/SeoScene";
import { GlobeScene, GlobeCaption } from "./scenes/GlobeScene";
import { MobileScene } from "./scenes/MobileScene";
import { SocialScene } from "./scenes/SocialScene";

/**
 * Hizmet sahneleri. Her biri 300vh'lik kendi zaman çizgisine sahip;
 * scroll o bölümde ilerledikçe sahne kurulur, anlatır ve dağılır.
 *
 * Sahne fabrikaları fonksiyon olduğu için bu dosya client olmak zorunda
 * (server component'ten client'a fonksiyon prop'u geçilemez).
 */
export function ServiceStages() {
  return (
    <>
      <ServiceStage
        id="seo"
        index="01"
        label="SEO & İçerik"
        title={
          <>
            Arama sonuçlarında
            <br />
            <span className="v2-italic">yukarı.</span>
          </>
        }
        description="Teknik altyapı, konu kümeleri ve otorite inşası. Grafiği yukarı taşıyan şey içerik değil, doğru sırayla yapılan işler."
        specs={[
          { k: "Organik trafik", v: "+312%" },
          { k: "İlk sayfa anahtar kelime", v: "1.400+" },
          { k: "Ortalama sonuç süresi", v: "4 ay" },
        ]}
        scene={(p) => <SeoScene progress={p} />}
      />

      <ServiceStage
        id="globe"
        index="02"
        label="360° Dijital Yönetim"
        title={
          <>
            Tüm kanallar,
            <br />
            <span className="v2-italic">tek merkez.</span>
          </>
        }
        description="Arama, sosyal, ürün ve ölçüm ayrı ajanslara dağıldığında kimse sonuçtan sorumlu olmuyor. Hepsini tek panelde topluyoruz."
        specs={[
          { k: "Yönetilen kanal", v: "9" },
          { k: "Raporlama", v: "Haftalık" },
          { k: "Tek panel", v: "GA4 + CRM" },
        ]}
        scene={(p) => <GlobeScene progress={p} />}
        overlay={(p) => <GlobeCaption progress={p} />}
      />

      <ServiceStage
        id="mobile"
        index="03"
        label="Mobil Uygulama & SaaS"
        title={
          <>
            Boş ekrandan
            <br />
            <span className="v2-italic">yayına.</span>
          </>
        }
        description="Tasarımdan App Store'a kadar tek ekip. Arayüz, backend, ödeme, bildirim, analitik — parça parça değil, bütün olarak."
        specs={[
          { k: "Platform", v: "iOS · Android · Web" },
          { k: "İlk sürüm", v: "8–12 hafta" },
          { k: "Kod mülkiyeti", v: "Sizde" },
        ]}
        scene={(p) => <MobileScene progress={p} />}
      />

      <ServiceStage
        id="social"
        index="04"
        label="Sosyal Medya"
        title={
          <>
            Ekrandan
            <br />
            <span className="v2-italic">taşan etkileşim.</span>
          </>
        }
        description="Kaydırma hızını kıran kreatif üretimi, topluluk yönetimi ve platform bazlı dağıtım stratejisi. Beğeni değil, satış konuşuyoruz."
        specs={[
          { k: "Aylık içerik", v: "24–40 varyasyon" },
          { k: "Platform", v: "Meta · TikTok · LinkedIn" },
          { k: "Ortalama etkileşim artışı", v: "+186%" },
        ]}
        scene={(p) => <SocialScene progress={p} />}
      />
    </>
  );
}
