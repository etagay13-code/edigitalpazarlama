"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_CHANGE, readConsent, type Consent } from "@/lib/consent";

type Integrations = {
  gtm: string | null;
  ga4: string | null;
  clarity: string | null;
  hotjar: string | null;
};

// Analiz betikleri yalnızca "Statistik" onayı verildiyse yüklenir.
export function ConsentScripts({ integrations: i }: { integrations: Integrations }) {
  const [stats, setStats] = useState(false);

  useEffect(() => {
    setStats(!!readConsent()?.stats);
    const on = (e: Event) => setStats((e as CustomEvent<Consent>).detail.stats);
    window.addEventListener(CONSENT_CHANGE, on);
    return () => window.removeEventListener(CONSENT_CHANGE, on);
  }, []);

  if (!stats) return null;

  // Consent Mode v2: yalnızca analiz onaylandı; reklam sinyalleri kapalı.
  const consentDefault = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
    gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});`;

  return (
    <>
      {(i.gtm || i.ga4) && (
        <Script id="consent-default" strategy="afterInteractive">
          {consentDefault}
        </Script>
      )}

      {/* Google Tag Manager */}
      {i.gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${i.gtm}');`}
        </Script>
      )}

      {/* Google Analytics 4 — yalnızca GTM YOKKEN doğrudan yüklenir.
          GTM varsa GA4 zaten konteynerdeki Google etiketiyle geliyor; ikisini
          birden yüklemek aynı sayfa görüntülemesini iki kez sayar. */}
      {!i.gtm && i.ga4 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${i.ga4}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${i.ga4}');`}
          </Script>
        </>
      )}

      {/* Microsoft Clarity */}
      {i.clarity && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${i.clarity}");`}
        </Script>
      )}

      {/* Hotjar */}
      {i.hotjar && (
        <Script id="hotjar" strategy="afterInteractive">
          {`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${i.hotjar},hjsv:6};
            a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </Script>
      )}
    </>
  );
}
