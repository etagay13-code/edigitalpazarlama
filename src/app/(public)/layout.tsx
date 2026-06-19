import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getBrand } from "@/lib/theme";
import { listServicesPublic } from "@/lib/data";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [brand, services] = await Promise.all([
    getBrand(),
    listServicesPublic(),
  ]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        İçeriğe geç
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
      />
      <main id="main" className="relative pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
