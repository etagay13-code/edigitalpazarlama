import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getBrand } from "@/lib/theme";

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
  const b = await getBrand();
  return {
    metadataBase: new URL(b.url),
    title: {
      default: `${b.name} — ${b.tagline}`,
      template: `%s · ${b.name}`,
    },
    description: b.description,
    keywords: [
      "dijital pazarlama ajansı",
      "Google Ads",
      "Meta Ads",
      "SEO",
      "mobil uygulama geliştirme",
      "SaaS geliştirme",
      "sosyal medya yönetimi",
      "performans pazarlama",
      b.founder,
    ],
    authors: [{ name: b.founder }],
    creator: b.founder,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: b.url,
      title: `${b.name} — ${b.tagline}`,
      description: b.description,
      siteName: b.name,
      images: b.ogImageUrl ? [{ url: b.ogImageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${b.name} — ${b.tagline}`,
      description: b.description,
      images: b.ogImageUrl ? [b.ogImageUrl] : undefined,
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
  const b = await getBrand();
  return (
    <html lang="tr" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
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

        {/* Google Analytics 4 */}
        {b.integrations.ga4 && (
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
