# Implementation Plan: Portafolio bilingüe (perfil + venta de servicios a PYMEs)

**Branch**: `001-portafolio-bilingue` | **Date**: 2026-07-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-portafolio-bilingue/spec.md`

## Summary

Portafolio web bilingüe (ES/EN) de Juan Camilo Codina Ariza con doble audiencia de igual prioridad
(reclutadores/CTOs y dueños de PYMEs) y la IA como hilo transversal. Enfoque técnico: **Next.js 16
(App Router, Turbopack) + React 19 + TypeScript** sobre **Tailwind v4** y **shadcn/ui**, i18n con
**`next-intl` v4** (rutas `app/[locale]` con pathnames localizados, SSG), contenido gestionable como
**datos `.ts`+zod + MDX** (`content/{es,en}`), motion con **GSAP 3.13** (`useGSAP`, ScrollTrigger,
SplitText, `matchMedia`) y hero 3D en **CSS 3D transforms** (sin R3F). SEO/GEO de primer nivel
(Metadata API, `sitemap`/`robots`/`llms.txt`, JSON-LD `@graph` con `sameAs`). Contacto multicanal:
**Server Action + Resend** con anti-spam en capas (honeypot → time-trap → `@upstash/ratelimit`),
**Calendly** en popup diferido, WhatsApp, email y LinkedIn. Arquitectura **híbrida**: home one-pager
premium + páginas indexables `/servicios/[familia]`, `/proyectos/[slug]`, `/perfil`. Despliegue en
Vercel. Detalle y justificación en [research.md](./research.md).

## Technical Context

**Language/Version**: TypeScript 5.x (strict), React 19, Node 20+ (runtime Vercel).

**Primary Dependencies**: Next.js 16 (App Router, Turbopack) · `next-intl` v4 · Tailwind CSS v4 ·
shadcn/ui (Radix) · `next-themes` · GSAP 3.13 + `@gsap/react` (ScrollTrigger, SplitText) · `zod` ·
`react-hook-form` + `@hookform/resolvers` · `resend` (+ React Email opcional) · `@upstash/ratelimit`
+ `@upstash/redis` · `geist` + `next/font/local` (Clash Display) · `@next/mdx` + `gray-matter` ·
`react-calendly` · `schema-dts` (tipos JSON-LD).

**Storage**: Sin base de datos. Contenido como archivos versionados: datos `.ts`/zod y MDX en
`content/{es,en}/…`. Rate limiting en Upstash Redis (solo contador anti-abuso, efímero).

**Testing**: Vitest (unit: esquemas zod, utilidades, `lib/contact`) · Playwright (E2E + visual
regression en 320/768/1024/1440, ambos temas) · `@axe-core/playwright` (accesibilidad) · Lighthouse
CI (Core Web Vitals) · `scripts/check-content.ts` (validación de contenido + paridad ES/EN en
`prebuild`).

**Target Platform**: Web (Vercel). Navegadores modernos (Chrome/Firefox/Safari), responsive desde
320px. SSG/ISR con funciones serverless (Node) para el envío de contacto.

**Project Type**: Aplicación web (frontend + endpoints serverless en el mismo proyecto Next.js).

**Performance Goals**: Core Web Vitals en producción — LCP < 2.5s, INP < 200ms, CLS < 0.1; FCP <
1.5s. Presupuesto JS de la home < 150 KB gzip (GSAP ≈ 40 KB, resto diferido). LCP = el nombre
(texto), nunca oculto por animación.

**Constraints**: WCAG 2.2 AA en **ambos** temas (acento cobre solo decorativo; texto con variantes
AA `#8A5A34`/`#E3B98C`); animar solo `transform`/`opacity`/`clip-path` (blur descartado del reveal);
respetar `prefers-reduced-motion`; sin secretos hardcodeados; sin texto hardcodeado (todo por
recursos de idioma); archivos < 800 líneas, funciones < 50.

**Scale/Scope**: 2 locales (ES/EN) · ~6 tipos de ruta (home, perfil, servicios índice + 4 familias,
proyectos índice + 3 casos, contacto) → ~15-20 URLs indexables · 3 proyectos reales v1 · 4 familias
de servicio con ~11 paquetes · 1 formulario. Blog en fase 2 (arquitectura preparada).

## Constitution Check

*GATE: verificado contra `.specify/memory/constitution.md` v1.1.0. Debe pasar antes de Fase 0 y
re-checarse tras Fase 1.*

| # | Principio | Cumple | Cómo lo satisface el diseño |
|---|-----------|--------|------------------------------|
| I | Visibilidad, SEO y GEO | ✅ | Metadata API por página/locale, `sitemap`/`robots`/`llms.txt`, JSON-LD `@graph` (Person/Service/CreativeWork/Breadcrumb/FAQ) con `sameAs`, SSG rastreable, hreflang + canónica por idioma, páginas indexables por tema (híbrido) |
| II | Conversión (doble ruta) | ✅ | Home bifurca "contratan"/"negocios"; servicios como landing (problema→qué recibes→resultado→CTA); gancho diagnóstico (Calendly); contacto multicanal con confirmación/errores |
| III | Accesibilidad AA (no negociable) | ✅ | HTML semántico, teclado + foco visible, contraste AA en ambos temas (variantes de cobre), `SplitText` sobre `<h1>` con `aria:"auto"`, `matchMedia` para reduced-motion, honeypot oculto también para AT, modal Calendly con focus trap |
| IV | Rendimiento y motion | ✅ | GSAP única librería (~40 KB), solo transform/opacity (blur fuera), CSS 3D en vez de R3F, `next/image`, dynamic import below-the-fold, LCP=texto no oculto, budget < 150 KB |
| V | i18n real ES/EN | ✅ | `next-intl` SSG, pathnames localizados, hreflang, `content/{es,en}` con paridad por slug, `check-content.ts` falla si un publicado no tiene EN, sin texto hardcodeado |
| VI | Calidad de código y diseño | ✅ | TS strict, tokens en 3 capas (`@theme inline`), tipografía Clash/Geist/Geist Mono, tema claro/oscuro sin flash, acento único cobre, reglas anti-"tells" (sin em-dash, un sistema de radios), archivos/ funciones acotados |
| VII | Contenido como datos | ✅ | Datos `.ts`+zod y MDX en `content/`; añadir proyecto/paquete = editar contenido, sin tocar componentes; loaders aislados en `lib/content/*` (patrón repositorio) |

**Puertas**: PASA. Sin violaciones que requieran justificación (ver Complexity Tracking).

**Notas / tensiones gestionadas (no bloqueantes)**:
- *Respaldo ES cuando falta EN*: matiza el "paridad total" del Principio V. Está definido en el spec
  como transitorio, con marcador visible y `lang="es"` en el bloque; `check-content.ts` exige paridad
  para contenido `published`. Aceptado y documentado.
- *`blur` en reveals*: fuera del allowlist de la constitución → se **omite** (reveal = opacity + y).
  Si se deseara profundidad, se usaría `clip-path`/máscara.
- *Terceros con JS (Calendly, Upstash)*: se cargan diferidos / server-only para no tocar CWV ni
  filtrar secretos; CSP debe permitir los orígenes de Calendly.

## Project Structure

### Documentation (this feature)

```text
specs/001-portafolio-bilingue/
├── plan.md              # Este archivo (/speckit-plan)
├── research.md          # Fase 0 (decisiones técnicas)
├── data-model.md        # Fase 1 (entidades + esquemas)
├── quickstart.md        # Fase 1 (guía de validación)
├── design-system.md     # Sistema de diseño y UX (destilado de skills de frontend)
├── contracts/           # Fase 1 (contratos de interfaz)
│   ├── contact.md       #   endpoint/acción de contacto
│   └── content.md       #   contrato de datos de contenido (autores)
├── checklists/
│   ├── requirements.md  # calidad de la spec (verde)
│   └── ux-design.md     # gate de calidad de diseño/UX
└── tasks.md             # Fase 2 (/speckit-tasks — NO lo crea /speckit-plan)
```

### Source Code (repository root)

```text
app/
├── [locale]/
│   ├── layout.tsx              # setRequestLocale, fuentes, ThemeProvider, NextIntlClientProvider
│   ├── (home)/page.tsx         # one-pager: Hero, DualPaths, Metrics, AIBand, teasers
│   ├── perfil/page.tsx         # /profile (EN) — JSON-LD Person
│   ├── servicios/
│   │   ├── page.tsx            # índice de familias
│   │   └── [familia]/page.tsx  # landing por familia (Service/Offer, FAQ)
│   ├── proyectos/
│   │   ├── page.tsx            # listado
│   │   └── [slug]/page.tsx     # detalle (CreativeWork) — MDX
│   ├── contacto/page.tsx       # formulario + canales
│   ├── opengraph-image.tsx     # OG dinámico (ImageResponse)
│   └── ...                     # not-found, error boundaries
├── api/contact/route.ts        # SOLO si se necesita endpoint HTTP público (variante)
├── actions/contact.ts          # Server Action (wrapper de lib/contact)
├── sitemap.ts · robots.ts      # con alternates/hreflang
├── fonts.ts                    # Geist + Geist Mono + Clash Display (next/font)
└── globals.css                 # Tailwind v4 @theme inline + tokens 3 capas

components/
├── hero/ (Hero, ShapesLayer, NameSplit)
├── home/ (DualPaths, Metrics, AIBand)
├── services/ · projects/ · contact/ (ContactForm, ChannelButtons, CalendlyPopup)
├── seo/ (JsonLd)
├── i18n/ (LocaleSwitcher) · theme/ (ThemeToggle, ThemeProvider)
├── motion/ (useReveal, useParallax — wrappers de GSAP)
└── ui/ (shadcn: Button, Form, Input, ...)

content/
├── es/ { perfil.ts, servicios/*.ts, proyectos/*.mdx, ui.ts | messages }
└── en/ { (misma estructura y slugs equivalentes) }

lib/
├── content/ (loaders tipados: profile, services, projects) — patrón repositorio
├── contact.ts (lógica pura: anti-spam + resend) · contact-schema.ts (zod compartido)
├── seo/ (helpers de metadata + builders JSON-LD)
└── utils.ts

i18n/ (routing.ts, request.ts, navigation.ts) · middleware.ts (matcher excluye sitemap/robots/llms)
messages/ { es.json, en.json }   # cadenas UI de next-intl
public/ { fonts/*.woff2, llms.txt, imágenes }
scripts/check-content.ts         # validación + paridad (prebuild)
tests/ { unit (vitest), e2e (playwright), a11y, visual }
```

**Structure Decision**: Aplicación web Next.js única (App Router) organizada **por dominio/feature**,
no por tipo (Principio VI). La arquitectura híbrida se materializa en el árbol de `app/[locale]/`:
la home es un one-pager y cada familia de servicio, cada proyecto y el perfil tienen su propia ruta
indexable. El contenido vive fuera de los componentes en `content/{es,en}` y se consume mediante
loaders aislados en `lib/content/*` para poder migrar el content-layer en el futuro sin tocar UI.

## Complexity Tracking

> Sin violaciones de la constitución que requieran justificación. El diseño usa el stack fijado y
> patrones estándar; no se introduce complejidad adicional (ni base de datos, ni segunda librería de
> animación, ni content-layer pesado). Tabla no aplicable.
