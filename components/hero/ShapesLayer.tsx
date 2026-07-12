"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { cn } from "@/lib/utils";

// Cubo wireframe (6 caras) con canto cobre. Sin transform inline: GSAP es dueño
// del transform (rotación + parallax) para no chocar.
function Cube({ size, className }: { size: number; className?: string }) {
  const t = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${t}px)`,
    `rotateY(90deg) translateZ(${t}px)`,
    `rotateY(180deg) translateZ(${t}px)`,
    `rotateY(270deg) translateZ(${t}px)`,
    `rotateX(90deg) translateZ(${t}px)`,
    `rotateX(-90deg) translateZ(${t}px)`,
  ];
  return (
    <div
      className={cn("shape shape-cube absolute [transform-style:preserve-3d]", className)}
      style={{ width: size, height: size }}
    >
      {faces.map((tf, i) => (
        <div
          key={i}
          className="absolute inset-0 border border-brand-copper/50 bg-brand-copper/[0.04]"
          style={{ transform: tf }}
        />
      ))}
    </div>
  );
}

export function ShapesLayer() {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 768px)",
        },
        (ctx) => {
          const c = ctx.conditions as { motion: boolean; desktop: boolean };
          if (!c.motion) return;
          gsap.to(".shape-cube", {
            rotateX: "+=360",
            rotateY: "+=360",
            duration: 26,
            repeat: -1,
            ease: "none",
          });
          gsap.to(".shape-ring", { rotateZ: "+=360", duration: 34, repeat: -1, ease: "none" });
          if (c.desktop) {
            const xTo = gsap.quickTo(".shape", "xPercent", { duration: 0.9, ease: "power3" });
            const yTo = gsap.quickTo(".shape", "yPercent", { duration: 0.9, ease: "power3" });
            const onMove = (e: PointerEvent) => {
              xTo((e.clientX / window.innerWidth - 0.5) * 14);
              yTo((e.clientY / window.innerHeight - 0.5) * 14);
            };
            window.addEventListener("pointermove", onMove);
            return () => window.removeEventListener("pointermove", onMove);
          }
        },
      );
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [perspective:1200px]"
    >
      {/* Auroras difuminadas */}
      <div className="absolute left-[6%] top-[12%] h-72 w-72 rounded-full bg-brand-copper/25 blur-[120px]" />
      <div className="absolute right-[8%] bottom-[10%] h-80 w-80 rounded-full bg-brand-navy/30 blur-[130px] dark:bg-brand-copper/15" />
      {/* Cubos (parallax + rotación) */}
      <Cube size={128} className="left-[12%] top-[22%]" />
      <Cube size={72} className="right-[16%] top-[28%]" />
      {/* Anillo en órbita: tilt estático + giro interno */}
      <div
        className="absolute right-[20%] bottom-[24%] [transform-style:preserve-3d]"
        style={{ transform: "rotateX(64deg)" }}
      >
        <div className="shape-ring h-56 w-56 rounded-full border-2 border-brand-copper/40" />
      </div>
      {/* Orbe cálido (parallax) */}
      <div className="shape absolute left-[22%] bottom-[18%] h-24 w-24 rounded-full bg-[radial-gradient(circle_at_30%_30%,#e3b98c,#b58863_45%,transparent_72%)]" />
    </div>
  );
}
