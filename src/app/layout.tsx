import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { getBrand } from "@/lib/theme";
import { asLocale, OG_LOCALE } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { Particles } from "@/components/Particles";
import { ConsentScripts } from "@/components/ConsentScripts";

async function currentLocale() {
  const h = await headers();
  return asLocale(h.get("x-locale"));
}

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
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

        {/* Analiz betikleri yalnızca çerez onayından sonra yüklenir. */}
        <ConsentScripts
          integrations={{
            gtm: b.integrations.gtm,
            ga4: b.integrations.ga4,
            clarity: b.integrations.clarity,
            hotjar: b.integrations.hotjar,
          }}
        />
      </body>
    </html>
  );
}
