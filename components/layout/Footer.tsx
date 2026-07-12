import { getLocale } from "next-intl/server";
import { getProfile } from "@/lib/content/profile";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export async function Footer() {
  const locale = (await getLocale()) as Locale;
  const profile = await getProfile(locale);
  const name = profile?.name ?? "Juan Camilo Codina Ariza";
  const roleLine = profile ? `${profile.title} · ${profile.location}` : "Bogotá, Colombia";

  return (
    <footer className="border-t border-border bg-brand-navy text-brand-bone">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg font-semibold">{name}</p>
          <p className="text-sm text-brand-bone/70">{roleLine}</p>
        </div>
        <nav aria-label="Social" className="flex gap-5 text-sm text-brand-bone/80">
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-bone"
          >
            LinkedIn
          </a>
          <a href={`mailto:${site.email}`} className="transition-colors hover:text-brand-bone">
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
