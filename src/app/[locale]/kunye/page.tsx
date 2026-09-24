import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getBrand } from "@/lib/theme";
import { getImprint } from "@/lib/legal";
import { asLocale } from "@/i18n/config";
import { pageMeta } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = asLocale(params.locale);
  const doc = getImprint(locale, await getBrand(locale));
  return pageMeta({ locale, internalPath: "/kunye", title: doc.title, description: doc.description });
}

export default async function ImprintPage({ params }: { params: { locale: string } }) {
  const locale = asLocale(params.locale);
  const doc = getImprint(locale, await getBrand(locale));
  return <LegalPage doc={doc} />;
}
