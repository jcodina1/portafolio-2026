import { getTranslations } from "next-intl/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";

const card =
  "group flex flex-col rounded-2xl border border-border bg-card p-8 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const kicker = "font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground";
const cta = "mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-link";

export async function DualPaths() {
  const t = await getTranslations("home");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Link href="/perfil" className={card}>
        <p className={kicker}>{t("dualHiringKicker")}</p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          {t("dualHiringTitle")}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("dualHiringBody")}</p>
        <span className={cta}>
          {t("dualHiringCta")} <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
      <Link href="/servicios" className={card}>
        <p className={kicker}>{t("dualBusinessKicker")}</p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">
          {t("dualBusinessTitle")}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("dualBusinessBody")}</p>
        <span className={cta}>
          {t("dualBusinessCta")} <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
}
