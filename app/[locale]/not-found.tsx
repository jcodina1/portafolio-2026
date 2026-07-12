"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="mx-auto flex min-h-[60dvh] max-w-[1400px] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted-foreground">404</p>
      <h1 className="font-display text-3xl font-semibold md:text-5xl">{t("title")}</h1>
      <Link
        href="/"
        className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
      >
        {t("cta")}
      </Link>
    </section>
  );
}
