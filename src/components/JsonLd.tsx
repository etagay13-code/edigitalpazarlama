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

export function OrganizationJsonLd({ brand }: { brand: ResolvedBrand }) {
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
          "@type": "Organization",
          name: brand.name,
          url: brand.url,
          email: brand.email,
          ...(brand.logoUrl ? { logo: brand.logoUrl } : {}),
          ...(brand.phone ? { telephone: brand.phone } : {}),
          description: brand.description,
          founder: { "@type": "Person", name: brand.founder },
          ...(sameAs.length ? { sameAs } : {}),
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: brand.name,
          url: brand.url,
        },
      ]}
    />
  );
}
