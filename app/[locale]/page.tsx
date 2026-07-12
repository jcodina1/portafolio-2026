import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/content/profile";
import { Hero } from "@/components/hero/Hero";
import { DualPaths } from "@/components/home/DualPaths";
import { Metrics } from "@/components/home/Metrics";
import { AIBand } from "@/components/home/AIBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { personJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { buildAlternates } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const profile = await getProfile(locale as Locale);
  return {
    title: profile ? `${profile.name} · ${profile.title}` : "Juan Camilo Codina Ariza",
    description: profile?.bioShort,
    alternates: buildAlternates(locale as Locale, { es: "/es", en: "/en" }),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = await getProfile(locale as Locale);

  return (
    <>
      {profile && (
        <>
          <JsonLd data={websiteJsonLd(locale)} />
          <JsonLd data={personJsonLd(profile)} />
        </>
      )}
      <Hero />
      <div className="mx-auto max-w-[1400px] space-y-24 px-6 py-24 md:px-8 md:py-32">
        <DualPaths />
        {profile && <Metrics items={profile.metrics} />}
        <AIBand />
      </div>
    </>
  );
}
