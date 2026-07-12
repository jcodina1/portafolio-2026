import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { profileSchema, serviceFamilySchema, projectSchema } from "../content/schema";

// Valida el contenido y la paridad ES/EN. Tolerante si aún no hay contenido (Bloque 1).
// Falla el build si un ítem `published` no tiene equivalente EN o si algo no valida.

const LOCALES = ["es", "en"] as const;
const ROOT = process.cwd();

async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const errors: string[] = [];
  const contentRoot = path.join(ROOT, "content");

  if (!(await exists(contentRoot))) {
    console.log("[check:content] Sin carpeta content/ todavía. OK (nada que validar).");
    return;
  }

  const published: Record<string, Set<string>> = { es: new Set(), en: new Set() };

  for (const locale of LOCALES) {
    const profilePath = path.join(contentRoot, locale, "perfil.json");
    if (await exists(profilePath)) {
      try {
        profileSchema.parse(JSON.parse(await fs.readFile(profilePath, "utf8")));
      } catch (e) {
        errors.push(`perfil (${locale}): ${(e as Error).message}`);
      }
    }

    const servDir = path.join(contentRoot, locale, "servicios");
    if (await exists(servDir)) {
      const files = (await fs.readdir(servDir)).filter((f) => f.endsWith(".json"));
      for (const f of files) {
        try {
          const fam = serviceFamilySchema.parse(
            JSON.parse(await fs.readFile(path.join(servDir, f), "utf8")),
          );
          published[locale].add(`service:${fam.slug}`);
        } catch (e) {
          errors.push(`servicio ${locale}/${f}: ${(e as Error).message}`);
        }
      }
    }

    const projDir = path.join(contentRoot, locale, "proyectos");
    if (await exists(projDir)) {
      const files = (await fs.readdir(projDir)).filter((f) => f.endsWith(".mdx"));
      for (const f of files) {
        try {
          const { data } = matter(await fs.readFile(path.join(projDir, f), "utf8"));
          const proj = projectSchema.parse({ ...data, slug: f.replace(/\.mdx$/, "") });
          if (proj.status === "published") published[locale].add(`project:${proj.slug}`);
        } catch (e) {
          errors.push(`proyecto ${locale}/${f}: ${(e as Error).message}`);
        }
      }
    }
  }

  for (const id of published.es) {
    if (!published.en.has(id)) {
      errors.push(`Paridad: '${id}' está publicado en ES pero falta en EN.`);
    }
  }

  if (errors.length) {
    console.error("[check:content] Errores:\n - " + errors.join("\n - "));
    process.exit(1);
  }
  console.log("[check:content] OK.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
