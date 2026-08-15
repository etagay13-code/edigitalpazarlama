import type { ResolvedBrand } from "@/lib/theme";

// Sayfa <head>'ine yapısal veri (schema.org) ekler — SEO / rich results.
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** SSS bölümleri için FAQPage — arama sonucunda açılır cevap kutuları çıkarır. */
export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  if (items.length === 0) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }}
    />
  );
}

export function OrganizationJsonLd({
  brand,
  locale,
}: {
  brand: ResolvedBrand;
  locale?: string;
}) {
  const sameAs = [
    brand.socials.instagram,
    brand.socials.linkedin,
    brand.socials.twitter,
    brand.socials.youtube,
  ].filter(Boolean);

  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          // ProfessionalService = LocalBusiness alt tipi: hem kurum hem de
          // adres/konum bilgisi taşır, Google İşletme Profili ile eşleşir.
          "@type": "ProfessionalService",
          name: brand.name,
          url: brand.url,
          email: brand.email,
          ...(brand.logoUrl ? { logo: brand.logoUrl, image: brand.logoUrl } : {}),
          ...(brand.phone ? { telephone: brand.phone } : {}),
          description: brand.description,
          founder: { "@type": "Person", name: brand.founder },
          priceRange: "$$",
          ...(brand.address
            ? {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "İstanbul",
                  addressCountry: "TR",
                  streetAddress: brand.address,
                },
                areaServed: ["TR", "DE", "AT", "CH", "EU"],
              }
            : {}),
          ...(locale ? { inLanguage: locale } : {}),
          // AggregateRating BİLEREK yok: site üzerindeki yorumlar kendi
          // beyanımız olduğu için işaretlenemez. Google Yorum Snippet'i
          // politikası, işletmenin kendi topladığı yorumları kendi sayfasında
          // işaretlemesini yasaklıyor. Clutch/Google İşletme Profili gibi
          // üçüncü taraf verisi bağlandığında burada tekrar değerlendirilecek.
          ...(sameAs.length ? { sameAs } : {}),
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: brand.name,
          url: brand.url,
          potentialAction: {
            "@type": "SearchAction",
            target: `${brand.url.replace(/\/$/, "")}/blog?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        },
      ]}
    />
  );
}
