import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-[1400px] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">
        Senior Fullstack · Líder de desarrollo · Bogotá
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
        Juan Camilo Codina
      </h1>
      <p className="max-w-[42ch] text-muted-foreground">{t("wip")}</p>
    </section>
  );
}
