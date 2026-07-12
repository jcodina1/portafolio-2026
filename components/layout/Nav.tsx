import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export async function Nav() {
  const t = await getTranslations("nav");
  const cta = await getTranslations("cta");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-md">
      <nav
        aria-label="Principal"
        className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-8"
      >
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-foreground"
        >
          {t("brand")}
        </Link>

        <div className="hidden items-center gap-7 text-sm md:flex">
          <Link href="/perfil" className="text-muted-foreground transition-colors hover:text-foreground">
            {t("perfil")}
          </Link>
          <Link href="/servicios" className="text-muted-foreground transition-colors hover:text-foreground">
            {t("servicios")}
          </Link>
          <Link href="/proyectos" className="text-muted-foreground transition-colors hover:text-foreground">
            {t("proyectos")}
          </Link>
          <Link href="/contacto" className="text-muted-foreground transition-colors hover:text-foreground">
            {t("contacto")}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />
          <Link
            href="/contacto"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {cta("hablemos")}
          </Link>
        </div>
      </nav>
    </header>
  );
}
