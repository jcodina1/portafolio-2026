import { PackageCard } from "./PackageCard";
import type { ServiceFamily } from "@/content/schema";

export function FamilyView({ family }: { family: ServiceFamily }) {
  return (
    <div>
      <header className="max-w-[68ch]">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
          {family.name}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">{family.tagline}</p>
      </header>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {family.packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
}
