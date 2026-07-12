"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap";

/**
 * Parallax de puntero para elementos `selector` dentro del scope, con gsap.quickTo
 * (un solo tween reutilizado, sin re-render). Solo desktop + prefers-reduced-motion:
 * no-preference. Anima `transform` (compositor).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  selector = ".parallax",
  strength = 40,
) {
  const scope = useRef<T>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
        () => {
          const xTo = gsap.quickTo(selector, "x", { duration: 0.6, ease: "power3" });
          const yTo = gsap.quickTo(selector, "y", { duration: 0.6, ease: "power3" });
          const onMove = (e: PointerEvent) => {
            xTo((e.clientX / window.innerWidth - 0.5) * strength);
            yTo((e.clientY / window.innerHeight - 0.5) * strength);
          };
          window.addEventListener("pointermove", onMove);
          return () => window.removeEventListener("pointermove", onMove);
        },
      );
    },
    { scope },
  );
  return scope;
}
