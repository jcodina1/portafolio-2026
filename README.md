# Portafolio — Juan Camilo Codina Ariza

Portafolio bilingüe (ES/EN) con doble propósito: mostrar el perfil profesional del autor y
vender servicios de desarrollo de software y automatización con IA a PYMEs. Construido con Spec Kit
y desarrollo asistido por IA (Claude Code).

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** + **shadcn/ui** (tokens de marca en 3 capas)
- **next-intl v4** (i18n ES/EN, rutas localizadas, SSG)
- **GSAP** (hero: SplitText + formas 3D en CSS + parallax)
- **next-themes** (tema claro/oscuro sin flash)
- **Resend** (formulario de contacto) · **Calendly** (diagnóstico) · anti-spam sin estado
- Contenido como datos: **JSON** (perfil, servicios) + **MDX** (proyectos), validado con **zod**

Sin base de datos. Desplegable en **Vercel**.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completar RESEND_* y NEXT_PUBLIC_* (Calendly/WhatsApp/…)
npm run dev                  # http://localhost:3000/es
```

## Scripts

| Script | Qué hace |
|--------|----------|
| `npm run dev` | Desarrollo |
| `npm run build` | Build de producción (corre `check:content` antes) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:content` | Valida contenido + paridad ES/EN |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:e2e` | E2E + accesibilidad (Playwright + axe) |

## Editar contenido (sin tocar componentes)

- **Perfil**: `content/{es,en}/perfil.json`
- **Servicios**: `content/{es,en}/servicios/*.json` (familias + paquetes + FAQ)
- **Proyectos**: `content/{es,en}/proyectos/*.mdx` (front-matter + narrativa)
- **Textos de UI**: `messages/{es,en}.json`

Regla: todo ítem `published` debe existir en ES y EN, o el build falla (paridad).

## Variables de entorno

Ver `.env.example`. Solo `NEXT_PUBLIC_*` llega al navegador; los secretos (Resend) son server-only.

## Arquitectura

- `app/[locale]/…` rutas SSG bilingües (home one-pager + `/perfil`, `/servicios/[familia]`, `/proyectos/[slug]`, `/contacto`)
- `components/` por dominio (hero, home, services, projects, contact, seo, motion, layout, ui)
- `lib/content/` loaders · `lib/seo/` metadata + JSON-LD · `content/schema.ts` esquemas zod
- `proxy.ts` middleware i18n · `next.config.ts` CSP + cabeceras de seguridad

La especificación completa vive en `specs/001-portafolio-bilingue/` (Spec Kit).
