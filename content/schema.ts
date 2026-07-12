import { z } from "zod";

// Esquemas zod = fuente de verdad de tipos (z.infer) y puerta de validación en build.
// Ver data-model.md. Implementación: perfil y servicios como JSON editable; proyectos
// como MDX (front-matter). Todo validado con estos esquemas.

export const linkSetSchema = z.object({
  linkedin: z.string().url(),
  github: z.string().url().optional(),
  email: z.string().email(),
  whatsapp: z
    .string()
    .regex(/^\d{7,15}$/, "Solo dígitos, formato internacional sin +")
    .optional(),
  calendly: z.string().url().optional(),
});

export const metricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  suffix: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  summary: z.string().min(1),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  bioShort: z.string().min(1),
  bioLong: z.string().min(1),
  photo: z.object({ src: z.string().min(1), alt: z.string().min(1) }),
  skills: z.array(z.string().min(1)).min(1),
  experience: z.array(experienceSchema).min(1),
  metrics: z.array(metricSchema).min(1),
  links: linkSetSchema,
});

export const servicePackageSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  hook: z.string().min(1),
  problem: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  outcome: z.string().min(1),
  cta: z.object({ label: z.string().min(1), href: z.string().min(1) }),
  featured: z.boolean().default(false),
});

export const serviceFamilySchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  tagline: z.string().min(1),
  packages: z.array(servicePackageSchema).min(1),
  faq: z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).default([]),
});

export const projectSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().min(1),
  role: z.string().min(1),
  stack: z.array(z.string().min(1)).min(1),
  problem: z.string().min(1),
  solution: z.string().min(1),
  result: z.string().min(1),
  screenshots: z
    .array(z.object({ src: z.string().min(1), alt: z.string().min(1) }))
    .default([]),
  links: z
    .object({ demo: z.string().url().optional(), repo: z.string().url().optional() })
    .default({}),
  origin: z.enum(["company", "personal"]),
  status: z.enum(["published", "coming-soon"]).default("published"),
  order: z.number().int().default(0),
});

export type LinkSet = z.infer<typeof linkSetSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type ServicePackage = z.infer<typeof servicePackageSchema>;
export type ServiceFamily = z.infer<typeof serviceFamilySchema>;
export type Project = z.infer<typeof projectSchema>;
