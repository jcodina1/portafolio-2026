"use client";

import { site } from "@/lib/site";
import { Link } from "@/i18n/navigation";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

// Carga el widget de Calendly SOLO al hacer clic (protege LCP/TBT). Si no hay
// URL configurada todavía, degrada a un enlace a la página de contacto.
export function CalendlyPopup({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const url = site.calendly;

  if (!url) {
    return (
      <Link href="/contacto" className={className}>
        {label}
      </Link>
    );
  }

  const open = async () => {
    if (!document.querySelector("link[data-calendly]")) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://assets.calendly.com/assets/external/widget.css";
      css.setAttribute("data-calendly", "");
      document.head.appendChild(css);
    }
    if (!window.Calendly) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "https://assets.calendly.com/assets/external/widget.js";
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Calendly no cargó"));
        document.body.appendChild(s);
      });
    }
    window.Calendly?.initPopupWidget({ url });
  };

  return (
    <button type="button" onClick={open} className={className}>
      {label}
    </button>
  );
}
