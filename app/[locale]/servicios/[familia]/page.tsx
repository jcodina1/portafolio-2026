import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getServiceFamilies, getServiceFamily } from "@/lib/content/services";
import { FamilyView } from "@/components/services/FamilyView";
import { JsonLd } from "@/components/seo/JsonLd";
import { PERSON_ID } from "@/lib/seo/jsonld";
import { buildAlternates } from "@/lib/seo/metadata";
import { routing, type Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const params: { locale: string; familia: string }[] = [];
  for (const locale of routing.locales) {
    const families = await getServiceFamilies(locale);
    for (const family of families) {
      params.push({ locale, familia: family.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; familia: string }>;
}): Promise<Metadata> {
  const { locale, familia } = await params;
  const family = await getServiceFamily(locale as Locale, familia);
  if (!family) return {};
  return {
    title: `${family.name} · Servicios`,
    description: family.tagline,
    alternates: buildAlternates(locale as Locale, {
      es: `/es/servicios/${familia}`,
      en: `/en/services/${familia}`,
    }),
  };
}

export default async function FamilyPage({
  params,
}: {
  params: Promise<{ locale: string; familia: string }>;
}) {
  const { locale, familia } = await params;
  setRequestLocale(locale);
  const family = await getServiceFamily(locale as Locale, familia);
  if (!family) notFound();

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: family.name,
    description: family.tagline,
    provider: { "@id": PERSON_ID },
    inLanguage: locale,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: family.name,
      itemListElement: family.packages.map((p) => ({
        "@type": "Offer",
        name: p.name,
        description: p.outcome,
      })),
    },
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-8 md:py-24">
      <JsonLd data={serviceLd} />
      <FamilyView family={family} />
    </div>
  );
}
