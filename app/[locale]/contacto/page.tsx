import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { ChannelButtons } from "@/components/contact/ChannelButtons";
import { buildAlternates } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates(locale as Locale, {
      es: "/es/contacto",
      en: "/en/contact",
    }),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-8 md:py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-[46ch] text-lg text-muted-foreground">{t("intro")}</p>
          <div className="mt-10">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {t("channels.heading")}
            </h2>
            <div className="mt-4">
              <ChannelButtons />
            </div>
          </div>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
