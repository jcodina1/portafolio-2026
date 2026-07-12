import { describe, it, expect } from "vitest";
import { projectSchema, serviceFamilySchema } from "@/content/schema";

describe("projectSchema", () => {
  it("rechaza campos requeridos faltantes", () => {
    expect(projectSchema.safeParse({ title: "x" }).success).toBe(false);
  });

  it("acepta un proyecto válido y aplica defaults", () => {
    const res = projectSchema.safeParse({
      title: "Demo",
      slug: "demo",
      summary: "Resumen",
      role: "Lead",
      stack: ["Next.js"],
      problem: "P",
      solution: "S",
      result: "R",
      origin: "company",
    });
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.status).toBe("published");
      expect(res.data.order).toBe(0);
    }
  });
});

describe("serviceFamilySchema", () => {
  it("exige al menos un paquete", () => {
    const res = serviceFamilySchema.safeParse({
      id: "automatizacion-ia",
      slug: "automatizacion-ia",
      name: "Automatización e IA",
      tagline: "…",
      packages: [],
    });
    expect(res.success).toBe(false);
  });
});
