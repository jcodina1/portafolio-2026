# Data Model: Portafolio bilingüe (Fase 1)

**Feature**: `001-portafolio-bilingue` · **Fecha**: 2026-07-11

No hay base de datos: las entidades son **contenido versionado** (`.ts`+zod y MDX) más un objeto
efímero (mensaje de contacto en tránsito). Los esquemas zod son la fuente de verdad de tipos
(`z.infer`) y la puerta de validación en build (`scripts/check-content.ts` + `schema.parse()` en
Server Components). Detalle de decisiones en [research.md](./research.md) §3.

## Convenciones i18n

- Almacén por idioma: `content/es/…` y `content/en/…` con **mismos nombres de archivo / slugs**.
- **ES es fuente de verdad**; EN puede faltar temporalmente para ítems no `published` (respaldo ES
  con marcador visible, `lang="es"`). Un ítem `published` sin EN **falla el build**.
- Emparejamiento entre idiomas por `id`/`slug` estable, nunca por título traducido.
- Cadenas de UI (navegación, botones, labels de formulario) viven en `messages/{es,en}.json`
  (next-intl), separadas del contenido de dominio.

## Entidades

### 1. Perfil (Autor) — `content/{locale}/perfil.ts`
Identidad profesional. Una instancia por idioma. Alimenta la home, `/perfil` y el JSON-LD `Person`.

| Campo | Tipo | Reglas |
|-------|------|--------|
| `name` | string | requerido; idéntico en ambos idiomas y a `sameAs` (consistencia de entidad) |
| `title` | string | requerido (rol/seniority) |
| `location` | string | requerido |
| `bioShort` | string | requerido (hero/meta) |
| `bioLong` | string (MD) | requerido (`/perfil`) |
| `photo` | `{ src, alt }` | `alt` requerido |
| `skills` | string[] | ≥ 1 |
| `experience` | `Experience[]` | ≥ 1 (empresa, rol, periodo, resumen) |
| `metrics` | `Metric[]` | ≥ 1 (`label`, `value`, `suffix?`) — contadores animados |
| `links` | `{ linkedin: url, github?: url, email: email, whatsapp?, calendly? }` | `linkedin` requerido; el resto opcional-auditado |

**Relaciones**: es el `provider` (`@id`) referenciado por cada Servicio en JSON-LD. `sameAs` deriva
de `links`.

### 2. Proyecto — `content/{locale}/proyectos/<slug>.mdx`
Caso de trabajo (narrativa en MDX + front-matter tipado). v1: 3 casos reales.

| Campo (front-matter) | Tipo | Reglas |
|----------------------|------|--------|
| `title` | string | requerido |
| `slug` | string | `^[a-z0-9-]+$`, único, paridad ES/EN |
| `summary` | string | requerido |
| `role` | string | requerido |
| `stack` | string[] | ≥ 1 |
| `problem` / `solution` / `result` | string | requeridos (narrativa larga en el cuerpo MDX) |
| `screenshots` | `{ src, alt }[]` | `alt` requerido; placeholders con seed hasta tener reales |
| `links` | `{ demo?: url, repo?: url }` | opcionales; validados como URL |
| `origin` | enum | `company` \| `personal` |
| `status` | enum | `published` \| `coming-soon` |
| `order` | number | orden de aparición |

**Estados**: `coming-soon` se muestra atenuado y sin enlace de detalle roto. **Casos v1**:
`windmar-plataforma` (company), `simulacion-financiera` (personal/freelance), `web-2-0` (company).

### 3. Familia de servicio — `content/{locale}/servicios/<familia>.ts`
Agrupación comercial con página indexable propia (`/servicios/[familia]`).

| Campo | Tipo | Reglas |
|-------|------|--------|
| `id` | string | requerido; paridad ES/EN (`automatizacion-ia`, `plataformas`, `sitios`, `soporte`) |
| `slug` | string | `^[a-z0-9-]+$` (localizado: p. ej. `automatizacion-ia`/`automation-ai`) |
| `name` | string | requerido |
| `tagline` | string | requerido (propuesta de valor de la familia) |
| `packages` | `ServicePackage[]` | ≥ 1 |
| `faq` | `{ q, a }[]` | opcional (alimenta `FAQPage` si es visible) |

### 4. Paquete de servicio — (dentro de la familia)
Oferta concreta. Estructura de venta: gancho → qué recibes → resultado → CTA.

| Campo | Tipo | Reglas |
|-------|------|--------|
| `id` / `slug` | string | requeridos, únicos por familia |
| `name` | string | requerido (p. ej. "MVP en 6 semanas") |
| `hook` | string | requerido (frase gancho) |
| `problem` | string | requerido (problema de negocio) |
| `deliverables` | string[] | ≥ 1 ("qué recibes") |
| `outcome` | string | requerido ("resultado") |
| `cta` | `{ label, href }` | requeridos (`href` → contacto/diagnóstico) |
| `featured` | boolean | opcional (destacar) |

**Catálogo v1**: Automatización e IA (Automatiza 1, Operación Conectada, Asistente IA) · Plataformas
(MVP en 6 semanas, Plataforma a medida) · Sitios (Landing Express, Sitio Pro) · Soporte (Cuidado,
Flujos Gestionados). Sin precios (`price` no se modela).

### 5. Mensaje de contacto — objeto efímero (no persistido)
Se valida en servidor y se envía por email; no se almacena.

| Campo | Tipo | Reglas |
|-------|------|--------|
| `nombre` | string | 2-80 |
| `email` | email | requerido → va en `replyTo` |
| `tipo` | enum | `empleo` \| `servicio` \| `otro` (segmenta el lead) |
| `mensaje` | string | 10-2000 |
| `company` (honeypot) | string | debe venir vacío; **fuera del zod schema** |
| `startedAt` (time-trap) | number | timestamp; **fuera del zod schema** |

Contrato completo del flujo en [contracts/contact.md](./contracts/contact.md).

### 6. Recurso de idioma (UI) — `messages/{locale}.json`
Cadenas de interfaz (nav, botones, labels, mensajes de estado). Reglas: paridad total de claves
entre ES y EN; sin texto de UI hardcodeado en componentes.

## Reglas de validación transversales (build)

- `alt` obligatorio en toda imagen (`photo`, `screenshots`).
- `href`/`links.*` validados como URL cuando existan.
- Paridad de `slug`/`id` entre `es/` y `en/`; toggle de idioma mapea por `id`.
- Un ítem `status: published` **requiere** su equivalente EN → si no, el build falla.
- Claves de `messages/es.json` == claves de `messages/en.json`.

## Esquema zod (esbozo, fuente de verdad de tipos)

```ts
// content/schema.ts (extracto)
export const linkSet = z.object({
  linkedin: z.string().url(),
  github: z.string().url().optional(),
  email: z.email(),
  whatsapp: z.string().regex(/^\d{7,15}$/).optional(),   // solo dígitos, formato wa.me
  calendly: z.string().url().optional(),
});

export const servicePackage = z.object({
  id: z.string().min(1), slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1), hook: z.string().min(1), problem: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1), outcome: z.string().min(1),
  cta: z.object({ label: z.string().min(1), href: z.string().min(1) }),
  featured: z.boolean().default(false),
});

export const serviceFamily = z.object({
  id: z.string().min(1), slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1), tagline: z.string().min(1),
  packages: z.array(servicePackage).min(1),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
});

export const project = z.object({
  title: z.string().min(1), slug: z.string().regex(/^[a-z0-9-]+$/),
  summary: z.string().min(1), role: z.string().min(1), stack: z.array(z.string()).min(1),
  problem: z.string().min(1), solution: z.string().min(1), result: z.string().min(1),
  screenshots: z.array(z.object({ src: z.string(), alt: z.string().min(1) })).default([]),
  links: z.object({ demo: z.string().url().optional(), repo: z.string().url().optional() }).default({}),
  origin: z.enum(["company", "personal"]),
  status: z.enum(["published", "coming-soon"]).default("published"),
  order: z.number().int().default(0),
});
```
