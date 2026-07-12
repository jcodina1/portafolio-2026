import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NameSplit } from "./NameSplit";
import { ShapesLayer } from "./ShapesLayer";

export async function Hero() {
  const t = await getTranslations("hero");
  const tc = await getTranslations("cta");

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      <ShapesLayer />
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-8">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {t("available")}
          </span>

          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground md:text-xs">
            {t("eyebrow")}
          </p>

          <NameSplit
            text="Juan Camilo Codina"
            className="mt-4 font-display text-[clamp(2.75rem,1rem+11vw,9.5rem)] font-semibold uppercase leading-[0.92] tracking-tight text-foreground"
          />

          <p className="mt-6 max-w-[48ch] text-base text-muted-foreground md:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/contacto"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {tc("hablemos")}
            </Link>
            <Link
              href="/servicios"
              className="rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {tc("verSoluciones")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
