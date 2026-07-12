import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { projectSchema, type Project } from "@/content/schema";
import type { Locale } from "@/i18n/routing";

const dirFor = (locale: Locale) =>
  path.join(process.cwd(), "content", locale, "proyectos");

/** Lee los proyectos (MDX con front-matter) de un idioma. Tolerante si aún no hay contenido. */
export async function getProjects(locale: Locale): Promise<Project[]> {
  const dir = dirFor(locale);
  let files: string[];
  try {
    files = (await fs.readdir(dir)).filter((f) => f.endsWith(".mdx"));
  } catch {
    return [];
  }
  const projects = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return projectSchema.parse({ ...data, slug: file.replace(/\.mdx$/, "") });
    }),
  );
  return projects.sort((a, b) => a.order - b.order);
}

export async function getProject(
  locale: Locale,
  slug: string,
): Promise<Project | null> {
  const all = await getProjects(locale);
  return all.find((p) => p.slug === slug) ?? null;
}
