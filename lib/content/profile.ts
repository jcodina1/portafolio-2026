import fs from "node:fs/promises";
import path from "node:path";
import { profileSchema, type Profile } from "@/content/schema";
import type { Locale } from "@/i18n/routing";

const fileFor = (locale: Locale) =>
  path.join(process.cwd(), "content", locale, "perfil.json");

/** Lee el perfil (JSON) de un idioma. Devuelve null si aún no existe. */
export async function getProfile(locale: Locale): Promise<Profile | null> {
  try {
    const raw = await fs.readFile(fileFor(locale), "utf8");
    return profileSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}
