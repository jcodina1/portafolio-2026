import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";
import { getServiceFamilies } from "@/lib/content/services";
import { getProjects } from "@/lib/content/projects";

// Sitemap completo con alternates ES/EN por ruta (US5, T073). Los slugs se leen
// del contenido (mismos en ambos idiomas); el pathname se localiza (servicios/services...).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [families, projects] = await Promise.all([
    getServiceFamilies("es"),
    getProjects("es"),
  ]);

  const routes: { es: string; en: string }[] = [
    { es: "/es", en: "/en" },
    { es: "/es/perfil", en: "/en/profile" },
    { es: "/es/servicios", en: "/en/services" },
    ...families.map((f) => ({
      es: `/es/servicios/${f.slug}`,
      en: `/en/services/${f.slug}`,
    })),
    { es: "/es/proyectos", en: "/en/projects" },
    ...projects.map((p) => ({
      es: `/es/proyectos/${p.slug}`,
      en: `/en/projects/${p.slug}`,
    })),
    { es: "/es/contacto", en: "/en/contact" },
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const r of routes) {
    const languages = { es: `${SITE_URL}${r.es}`, en: `${SITE_URL}${r.en}` };
    for (const locale of ["es", "en"] as const) {
      entries.push({
        url: `${SITE_URL}${r[locale]}`,
        lastModified: now,
        alternates: { languages },
      });
    }
  }
  return entries;
}
