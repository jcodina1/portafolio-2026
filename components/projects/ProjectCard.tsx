import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/content/schema";

export async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations("common");
  const isComing = project.status === "coming-soon";
  const shot = project.screenshots[0];

  const inner = (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {shot && (
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
        {isComing && (
          <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs backdrop-blur">
            {t("comingSoon")}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold tracking-tight">{project.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{project.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </article>
  );

  if (isComing) return <div className="opacity-70">{inner}</div>;
  return (
    <Link
      href={{ pathname: "/proyectos/[slug]", params: { slug: project.slug } }}
      className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {inner}
    </Link>
  );
}
