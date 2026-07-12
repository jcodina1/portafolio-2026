"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("language");
  const other = locale === "es" ? "en" : "es";

  return (
    <button
      type="button"
      onClick={() =>
        router.replace(
          // @ts-expect-error -- los params corresponden a la ruta actual
          { pathname, params },
          { locale: other },
        )
      }
      aria-label={t("switch")}
      className="rounded-full border border-border px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {other}
    </button>
  );
}
