import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("nav");

  return (
    <footer className="border-t border-border bg-brand-navy text-brand-bone">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="font-display text-lg font-semibold">Juan Camilo Codina Ariza</p>
          <p className="text-sm text-brand-bone/70">
            Desarrollador Frontend/Fullstack Senior · Bogotá, Colombia
          </p>
        </div>
        <nav aria-label="Enlaces" className="flex gap-5 text-sm text-brand-bone/80">
          <a
            href="https://www.linkedin.com/in/jcodina1"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-brand-bone"
          >
            LinkedIn
          </a>
          <a
            href="mailto:jcodina1997@gmail.com"
            className="transition-colors hover:text-brand-bone"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
