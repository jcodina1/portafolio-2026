import { getTranslations } from "next-intl/server";

export async function AIBand() {
  const t = await getTranslations("home");
  const steps = [
    { n: "01", title: t("aiStep1Title"), body: t("aiStep1Body") },
    { n: "02", title: t("aiStep2Title"), body: t("aiStep2Body") },
    { n: "03", title: t("aiStep3Title"), body: t("aiStep3Body") },
  ];
  return (
    <section className="relative overflow-hidden rounded-3xl bg-brand-navy px-6 py-14 text-brand-bone md:px-12 md:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-brand-copper/20 blur-[100px]"
      />
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-copper">
        {t("aiKicker")}
      </p>
      <h2 className="mt-3 max-w-[24ch] font-display text-3xl font-semibold tracking-tight md:text-4xl">
        {t("aiTitle")}
      </h2>
      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="border-t border-brand-bone/15 pt-4">
            <span className="font-mono text-sm text-brand-copper">{s.n}</span>
            <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-brand-bone/75">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
