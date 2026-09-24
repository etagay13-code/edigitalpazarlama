import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getBrand } from "@/lib/theme";
import { getPrivacy } from "@/lib/legal";
import { asLocale } from "@/i18n/config";
import { pageMeta } from "@/i18n/metadata";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = asLocale(params.locale);
  const doc = getPrivacy(locale, await getBrand(locale));
  return pageMeta({ locale, internalPath: "/gizlilik-politikasi", title: doc.title, description: doc.description });
}

export default async function PrivacyPage({ params }: { params: { locale: string } }) {
  const locale = asLocale(params.locale);
  const doc = getPrivacy(locale, await getBrand(locale));
  return <LegalPage doc={doc} />;
}
