"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "./gsap";

/**
 * Reveal al entrar en viewport para elementos con clase `.reveal` dentro del scope.
 * Solo `opacity` + `translateY` (sin blur). Se desactiva con prefers-reduced-motion
 * vía gsap.matchMedia; el estado base ya es visible.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const scope = useRef<T>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(".reveal", { opacity: 0, y: 24 });
        ScrollTrigger.batch(".reveal", {
          start: "top 85%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.6,
              ease: "power3.out",
              overwrite: true,
            }),
        });
      });
    },
    { scope },
  );
  return scope;
}
