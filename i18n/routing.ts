import { defineRouting } from "next-intl/routing";

// Rutas localizadas ES/EN (T009, FR-020). El emparejamiento entre idiomas es por
// clave interna; el pathname visible se localiza por locale.
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/perfil": { es: "/perfil", en: "/profile" },
    "/servicios": { es: "/servicios", en: "/services" },
    "/servicios/[familia]": { es: "/servicios/[familia]", en: "/services/[familia]" },
    "/proyectos": { es: "/proyectos", en: "/projects" },
    "/proyectos/[slug]": { es: "/proyectos/[slug]", en: "/projects/[slug]" },
    "/contacto": { es: "/contacto", en: "/contact" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
