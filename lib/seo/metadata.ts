import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

/**
 * Construye canónica + hreflang para una ruta dada sus pathnames por locale.
 * `pathnames` mapea cada locale a su pathname ya localizado (con prefijo de idioma),
 * p. ej. { es: "/es/servicios", en: "/en/services" }. US5 (T070-T072) lo consume por página.
 */
export function buildAlternates(
  locale: Locale,
  pathnames: Record<Locale, string>,
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = absoluteUrl(pathnames[l]);
  }
  languages["x-default"] = absoluteUrl(pathnames[routing.defaultLocale]);
  return {
    canonical: absoluteUrl(pathnames[locale]),
    languages,
  };
}
