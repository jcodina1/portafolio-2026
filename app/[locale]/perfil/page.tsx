import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProfile } from "@/lib/content/profile";
import { JsonLd } from "@/components/seo/JsonLd";
import { personJsonLd } from "@/lib/seo/jsonld";
import { buildAlternates } from "@/lib/seo/metadata";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const profile = await getProfile(locale as Locale);
  return {
    title: profile ? `${profile.name} · ${profile.title}` : "Perfil",
    description: profile?.bioShort,
    alternates: buildAlternates(locale as Locale, { es: "/es/perfil", en: "/en/profile" }),
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = await getProfile(locale as Locale);
  if (!profile) notFound();
  const t = await getTranslations("profile");
  const tc = await getTranslations("cta");

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-8 md:py-24">
      <JsonLd data={personJsonLd(profile)} />

      <div className="grid gap-12 md:grid-cols-[280px_1fr]">
        <div>
          <Image
            src={profile.photo.src}
            alt={profile.photo.alt}
            width={480}
            height={600}
            className="w-full rounded-2xl border border-border object-cover"
          />
        </div>
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {profile.location}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-xl text-muted-foreground">{profile.title}</p>
          <p className="mt-6 max-w-[65ch] text-lg leading-relaxed">{profile.bioLong}</p>

          <h2 className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {t("skills")}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/contacto"
              className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {t("contactCta")}
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <h2 className="font-display text-2xl font-semibold tracking-tight">{t("experience")}</h2>
        <div className="mt-6 divide-y divide-border border-t border-border">
          {profile.experience.map((e) => (
            <div key={`${e.company}-${e.period}`} className="grid gap-2 py-6 md:grid-cols-[1fr_2fr]">
              <div>
                <p className="font-medium">{e.company}</p>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {e.period}
                </p>
              </div>
              <div>
                <p className="font-medium">{e.role}</p>
                <p className="mt-1 text-sm text-muted-foreground">{e.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
