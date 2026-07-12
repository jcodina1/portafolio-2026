import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getProjects, getProject } from "@/lib/content/projects";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildAlternates } from "@/lib/seo/metadata";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const projects = await getProjects(locale);
    for (const p of projects) params.push({ locale, slug: p.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(locale as Locale, slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: buildAlternates(locale as Locale, {
      es: `/es/proyectos/${slug}`,
      en: `/en/projects/${slug}`,
    }),
  };
}

const sectionLabel = "font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground";

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = await getProject(locale as Locale, slug);
  if (!project) notFound();
  const t = await getTranslations("projects");

  const ld = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    inLanguage: locale,
    keywords: project.stack.join(", "),
    ...(project.links.demo ? { url: project.links.demo } : {}),
  };

  const shot = project.screenshots[0];

  return (
    <article className="mx-auto max-w-[900px] px-6 py-16 md:py-24">
      <JsonLd data={ld} />
      <Link
        href="/proyectos"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} /> {t("back")}
      </Link>

      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight md:text-5xl">
        {project.title}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground">{project.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <span>
          <span className={sectionLabel}>{t("role")}: </span>
          {project.role}
        </span>
        <span className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </span>
      </div>

      {shot && (
        <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-2xl border border-border">
          <Image src={shot.src} alt={shot.alt} fill sizes="(min-width: 900px) 900px, 100vw" className="object-cover" />
        </div>
      )}

      <div className="mt-10 space-y-8">
        <section>
          <h2 className={sectionLabel}>{t("problem")}</h2>
          <p className="mt-2 leading-relaxed">{project.problem}</p>
        </section>
        <section>
          <h2 className={sectionLabel}>{t("solution")}</h2>
          <p className="mt-2 leading-relaxed">{project.solution}</p>
        </section>
        <section>
          <h2 className={sectionLabel}>{t("result")}</h2>
          <p className="mt-2 leading-relaxed">{project.result}</p>
        </section>
      </div>

      {project.links.demo && (
        <div className="mt-10">
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
          >
            {t("visit")} <ArrowUpRight size={16} weight="bold" />
          </a>
        </div>
      )}
    </article>
  );
}
