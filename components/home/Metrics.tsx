"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/components/motion/gsap";
import type { Profile } from "@/content/schema";

export function Metrics({ items }: { items: Profile["metrics"] }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const nums = gsap.utils.toArray<HTMLElement>(".metric-count");
        nums.forEach((el) => {
          const target = Number(el.dataset.value ?? "0");
          if (!target) return;
          const state = { v: 0 };
          gsap.to(state, {
            v: target,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
            onUpdate: () => {
              el.textContent = String(Math.round(state.v));
            },
          });
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {items.map((m) => {
        const numeric = /^\d+$/.test(m.value);
        return (
          <div key={m.label}>
            <p className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              <span className="metric-count" data-value={numeric ? m.value : "0"}>
                {m.value}
              </span>
              {m.suffix ?? ""}
            </p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {m.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}
