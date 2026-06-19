import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { brand } from "@/lib/theme";

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

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.description,
  keywords: [
    "dijital pazarlama ajansı",
    "Google Ads",
    "Meta Ads",
    "SEO",
    "mobil uygulama geliştirme",
    "SaaS geliştirme",
    "sosyal medya yönetimi",
    "performans pazarlama",
    "Emre Tagay",
  ],
  authors: [{ name: brand.founder }],
  creator: brand.founder,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: brand.url,
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
    siteName: brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.description,
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-black"
        >
          İçeriğe geç
        </a>
        <Navbar />
        <main id="main" className="relative pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
