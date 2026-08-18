import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import { getBrand } from "@/lib/theme";
import { asLocale, OG_LOCALE } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { Particles } from "@/components/Particles";

async function currentLocale() {
  const h = await headers();
  return asLocale(h.get("x-locale"));
}

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await currentLocale();
  const b = await getBrand(locale);
  return {
    metadataBase: new URL(b.url),
    title: {
      default: `${b.name} — ${b.tagline}`,
      template: `%s · ${b.name}`,
    },
    description: b.description,
    keywords: [...getDict(locale).meta.keywords, b.founder],
    authors: [{ name: b.founder }],
    creator: b.founder,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: b.url,
      title: `${b.name} — ${b.tagline}`,
      description: b.description,
      siteName: b.name,
      // Paylaşım görseli: admin'den yüklenmişse o, yoksa dile göre hazır görsel.
      images: [
        b.ogImageUrl
          ? { url: b.ogImageUrl }
          : { url: `/og/og-${locale}.jpg`, width: 1200, height: 630, alt: b.name },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${b.name} — ${b.tagline}`,
      description: b.description,
      images: [b.ogImageUrl ?? `/og/og-${locale}.jpg`],
    },
    icons: {
      icon: b.faviconUrl
        ? [{ url: b.faviconUrl }]
        : [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    verification: b.integrations.searchConsole
      ? { google: b.integrations.searchConsole }
      : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await currentLocale();
  const b = await getBrand(locale);
  return (
    <html lang={locale} className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <Particles />
        {children}

        {/* Google Tag Manager */}
        {b.integrations.gtm && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${b.integrations.gtm}');`}
          </Script>
        )}

        {/* Google Analytics 4 — yalnızca GTM YOKKEN doğrudan yüklenir.
            GTM varsa GA4 zaten konteynerdeki Google etiketiyle geliyor; ikisini
            birden yüklemek aynı sayfa görüntülemesini iki kez sayar. Ölçüm tek
            kaynaktan (GTM) akar, kimlik değişikliği kod değil konteyner işidir. */}
        {!b.integrations.gtm && b.integrations.ga4 && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${b.integrations.ga4}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${b.integrations.ga4}');`}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        {b.integrations.clarity && (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${b.integrations.clarity}");`}
          </Script>
        )}

        {/* Hotjar */}
        {b.integrations.hotjar && (
          <Script id="hotjar" strategy="afterInteractive">
            {`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:${b.integrations.hotjar},hjsv:6};
              a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
          </Script>
        )}
      </body>
    </html>
  );
}
