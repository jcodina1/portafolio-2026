import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

// Permite todos los crawlers, incluidos los de IA (GEO). US5 (T073) puede añadir
// reglas explícitas por user-agent si se necesita.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
