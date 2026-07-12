import fs from "node:fs/promises";
import path from "node:path";
import { serviceFamilySchema, type ServiceFamily } from "@/content/schema";
import type { Locale } from "@/i18n/routing";

const dirFor = (locale: Locale) =>
  path.join(process.cwd(), "content", locale, "servicios");

/** Lee las familias de servicio (JSON) de un idioma. Tolerante si aún no hay contenido. */
export async function getServiceFamilies(locale: Locale): Promise<ServiceFamily[]> {
  const dir = dirFor(locale);
  let files: string[];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const families = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      return serviceFamilySchema.parse(JSON.parse(raw));
    }),
  );
  return families;
}

export async function getServiceFamily(
  locale: Locale,
  slug: string,
): Promise<ServiceFamily | null> {
  const all = await getServiceFamilies(locale);
  return all.find((f) => f.slug === slug) ?? null;
}
