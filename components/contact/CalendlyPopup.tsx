"use client";

import { site } from "@/lib/site";
import { Link } from "@/i18n/navigation";

// Solo rutas estáticas (las dinámicas requieren params en el Link de next-intl).
type StaticHref = "/" | "/perfil" | "/servicios" | "/proyectos" | "/contacto";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

// Una sola carga del script/CSS de Calendly, aunque se hagan clics rápidos
// (promesa a nivel de módulo evita inyección duplicada).
let loadPromise: Promise<void> | null = null;

function loadCalendly(): Promise<void> {
  if (typeof window !== "undefined" && window.Calendly) return Promise.resolve();
  if (loadPromise) return loadPromise;
  loadPromise = new Promise<void>((resolve, reject) => {
    if (!document.querySelector("link[data-calendly]")) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://assets.calendly.com/assets/external/widget.css";
      css.setAttribute("data-calendly", "");
      document.head.appendChild(css);
    }
    const s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loadPromise = null;
      reject(new Error("Calendly no cargó"));
    };
    document.body.appendChild(s);
  });
  return loadPromise;
}

// Abre Calendly en popup (carga diferida por clic). Si no hay URL configurada,
// degrada a un enlace interno (fallbackHref).
export function CalendlyPopup({
  label,
  className,
  fallbackHref = "/contacto",
}: {
  label: string;
  className?: string;
  fallbackHref?: StaticHref;
}) {
  const url = site.calendly;

  if (!url) {
    return (
      <Link href={fallbackHref} className={className}>
        {label}
      </Link>
    );
  }

  const open = async () => {
    try {
      await loadCalendly();
      window.Calendly?.initPopupWidget({ url });
    } catch {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button type="button" onClick={open} className={className}>
      {label}
    </button>
  );
}
