import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProjects } from "@/lib/content/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { buildAlternates } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates(locale as Locale, { es: "/es/proyectos", en: "/en/projects" }),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const projects = await getProjects(locale as Locale);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-8 md:py-24">
      <header className="max-w-[68ch]">
        <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("intro")}</p>
      </header>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
