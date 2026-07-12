import { getTranslations } from "next-intl/server";
import { Check } from "@phosphor-icons/react/dist/ssr";
import { CalendlyPopup } from "@/components/contact/CalendlyPopup";
import { cn } from "@/lib/utils";
import type { ServicePackage } from "@/content/schema";

export async function PackageCard({ pkg }: { pkg: ServicePackage }) {
  const t = await getTranslations("services");

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border bg-card p-6 shadow-[0_18px_44px_-28px_rgba(20,41,59,0.45)]",
        pkg.featured ? "border-primary ring-1 ring-primary/40" : "border-border",
      )}
    >
      <h3 className="font-display text-xl font-semibold tracking-tight">{pkg.name}</h3>
      <p className="mt-2 font-medium">{pkg.hook}</p>
      <p className="mt-2 text-sm text-muted-foreground">{pkg.problem}</p>

      <div className="mt-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {t("deliverables")}
        </p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {pkg.deliverables.map((d) => (
            <li key={d} className="flex gap-2">
              <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-primary" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 text-sm">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {t("outcome")}:{" "}
        </span>
        {pkg.outcome}
      </p>

      <div className="mt-6 flex-1 items-end pt-2">
        <CalendlyPopup
          label={pkg.cta.label}
          fallbackHref={pkg.cta.href as "/contacto"}
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:brightness-105 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        />
      </div>
    </article>
  );
}
