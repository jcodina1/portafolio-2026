import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getServiceFamilies } from "@/lib/content/services";
import { Link } from "@/i18n/navigation";
import { CalendlyPopup } from "@/components/contact/CalendlyPopup";
import { buildAlternates } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates(locale as Locale, {
      es: "/es/servicios",
      en: "/en/services",
    }),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tc = await getTranslations("cta");
  const families = await getServiceFamilies(locale as Locale);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-8 md:py-24">
      <header className="max-w-[68ch]">
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("intro")}</p>
      </header>

      <section className="mt-10 rounded-2xl border border-border bg-brand-navy p-8 text-brand-bone">
        <h2 className="font-display text-2xl font-semibold">{t("diagnosisTitle")}</h2>
        <p className="mt-2 max-w-[60ch] text-brand-bone/80">{t("diagnosisBody")}</p>
        <div className="mt-5">
          <CalendlyPopup
            label={tc("diagnostico")}
            className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
        </div>
      </section>

      <h2 className="mt-16 font-display text-2xl font-semibold tracking-tight">
        {t("familiesHeading")}
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {families.map((family) => (
          <Link
            key={family.id}
            href={{ pathname: "/servicios/[familia]", params: { familia: family.slug } }}
            className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <h3 className="font-display text-xl font-semibold">{family.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{family.tagline}</p>
            <p className="mt-4 text-sm font-medium text-link">{t("viewFamily")} →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
