import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
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

  const t = await getTranslations("services");
  const faqLd =
    family.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: family.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-8 md:py-24">
      <JsonLd data={serviceLd} />
      {faqLd && <JsonLd data={faqLd} />}
      <FamilyView family={family} />
      {family.faq.length > 0 && (
        <section className="mt-16 max-w-[68ch]">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{t("faqHeading")}</h2>
          <dl className="mt-6 divide-y divide-border border-t border-border">
            {family.faq.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
