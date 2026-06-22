import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getBrand } from "@/lib/theme";
import { listServicesPublic } from "@/lib/data";
import { LOCALES, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { OrganizationJsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = getDict(locale);

  const [brand, services] = await Promise.all([
    getBrand(locale),
    listServicesPublic(locale),
  ]);

  return (
    <>
      <OrganizationJsonLd brand={brand} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        {t.common.skipToContent}
      </a>
      <Navbar
        services={services.map((s) => ({
          slug: s.slug,
          title: s.title,
          short: s.short,
          icon: s.icon,
          accent: s.accent,
        }))}
        logoUrl={brand.logoUrl}
        brandName={brand.name}
        locale={locale}
        dict={t.nav}
      />
      <main id="main" className="relative pt-20">
        {children}
      </main>
      <Footer locale={locale} />
    </>
  );
}
