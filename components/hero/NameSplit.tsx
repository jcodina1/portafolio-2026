"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

// Titular gigante (LCP). Reveal por líneas ENMASCARADAS: solo transform (yPercent),
// la opacidad se mantiene en 1 -> el texto pinta de inmediato (LCP-safe). Sobre un
// <h1> semántico con aria:"auto" (los lectores leen el nombre completo).
export function NameSplit({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          aria: "auto",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1,
              stagger: 0.12,
              ease: "power4.out",
            }),
        });
        return () => split.revert();
      });
    },
    { scope: ref },
  );

  return (
    <h1 ref={ref} className={className}>
      {text}
    </h1>
  );
}
