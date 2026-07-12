"use client";

import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const items = [
  { href: "/perfil", key: "perfil" },
  { href: "/servicios", key: "servicios" },
  { href: "/proyectos", key: "proyectos" },
  { href: "/contacto", key: "contacto" },
] as const;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={t("menu")}
        onClick={() => setOpen((o) => !o)}
        className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background/95 backdrop-blur-md"
        >
          <nav
            aria-label={t("menu")}
            className="mx-auto flex max-w-[1400px] flex-col gap-1 px-6 py-4"
          >
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
              >
                {t(it.key)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
