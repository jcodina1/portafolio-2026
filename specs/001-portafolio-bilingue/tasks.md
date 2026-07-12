---
description: "Task list for Portafolio bilingüe implementation"
---

# Tasks: Portafolio bilingüe (perfil + venta de servicios a PYMEs)

**Input**: Design documents from `specs/001-portafolio-bilingue/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [design-system.md](./design-system.md)

**Tests**: INCLUIDOS. La constitución (puertas de calidad: WCAG AA, Core Web Vitals, paridad i18n,
seguridad) y las reglas de testing web exigen accesibilidad automatizada, regresión visual y
Lighthouse. Enfoque pragmático: unit (esquemas zod, `lib/contact`), E2E + axe por historia, regresión
visual, CWV y verificación de cabeceras en Polish. No TDD estricto por componente.

**Nota de revisión (post `/speckit-analyze`, 2026-07-11)**: aplicados F1 (pathnames localizados a
Foundational), C1 (propiedad de SEO por historia; US5 solo completa/enlaza), A1 (CTA único "Agenda
tu diagnóstico gratis"). Eliminado Upstash/Redis (anti-spam sin estado). Añadidas seguridad
(cabeceras + CSP) y estados de carga; el propio portafolio se incluye como 4º proyecto.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: paralelizable (archivos distintos, sin dependencias pendientes)
- **[Story]**: US1-US6. Rutas de archivo exactas en cada tarea. Estructura: ver [plan.md](./plan.md).

---

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 Inicializar proyecto Next.js 16 (App Router, TypeScript, Turbopack, React 19) en la raíz
- [x] T002 [P] Configurar Tailwind CSS v4 (`@tailwindcss/postcss`, `app/globals.css` con `@import "tailwindcss"`)
- [x] T003 [P] Inicializar shadcn/ui y añadir base (`button card input textarea label form dialog`) en `components/ui/`
- [x] T004 [P] TypeScript strict, ESLint y Prettier (`tsconfig.json`, `eslint.config.mjs`, `.prettierrc`)
- [x] T005 [P] Instalar deps: `next-intl gsap @gsap/react next-themes zod react-hook-form @hookform/resolvers resend geist @phosphor-icons/react @next/mdx gray-matter react-calendly schema-dts` (sin Upstash/Redis)
- [x] T006 [P] Fuentes en `app/fonts.ts` (Geist + Geist Mono vía `geist`; Clash Display vía `next/font/local`, woff2 subset Latin-1 en `public/fonts/`)
- [x] T007 [P] `.env.example` con `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` y `NEXT_PUBLIC_*` (Calendly/WhatsApp/email/LinkedIn); sin variables de Redis
- [x] T008 Scripts en `package.json` (`dev`, `build`, `prebuild=check:content`, `typecheck`, `test`, `test:e2e`, `lhci`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: i18n, tokens/tema, modelo de contenido, SEO base, motion, shell, seguridad, carga y
arnés de pruebas. **⚠️ Ninguna historia empieza hasta completar esta fase.**

### i18n (routing SSG)

- [x] T009 [P] `i18n/routing.ts` (locales `es`/`en`, default `es`, `localePrefix: 'always'`, **pathnames localizados**: `proyectos`↔`projects`, `servicios`↔`services`, `perfil`↔`profile`, `contacto`↔`contact`)
- [x] T010 [P] `i18n/request.ts` (`getRequestConfig` carga `messages/{locale}.json`)
- [x] T011 [P] `i18n/navigation.ts` (`createNavigation(routing)`)
- [x] T012 `middleware.ts` (`createMiddleware` + matcher EXCLUYE `_next`, `api`, `sitemap.xml`, `robots.txt`, `llms.txt`) (dep T009)
- [x] T013 `app/[locale]/layout.tsx` (`setRequestLocale`, `generateStaticParams`, `<html lang>` + `suppressHydrationWarning`, fuentes, providers) (dep T006, T009-T011)
- [x] T014 [P] Mensajes UI base `messages/es.json` y `messages/en.json` (nav, CTAs, labels, estados de carga/error)

### Tokens y tema

- [x] T015 [P] `app/globals.css` (3 capas: primitivos → semánticos `:root`/`.dark` → `@theme inline`; `@custom-variant dark`; `color-scheme`; variantes AA del cobre) (dep T002)
- [x] T016 `app/providers.tsx` (`next-themes` `attribute="class"`, `disableTransitionOnChange`) y cablear en layout (dep T013)

### Modelo de contenido

- [x] T017 [P] `content/schema.ts` (zod: profile, project, serviceFamily, servicePackage, helper `localized`) (dep T005)
- [x] T018 [P] `lib/content/{profile,services,projects}.ts` (patrón repositorio; `gray-matter`) (dep T017)
- [x] T019 `next.config.ts` (`createMDX`) + `mdx-components.tsx` (dep T001)
- [x] T020 `scripts/check-content.ts` (zod + paridad ES/EN + paridad de slugs) y cablear `prebuild` (dep T017, T018)

### SEO/GEO base

- [x] T021 [P] `lib/seo/metadata.ts` (`metadataBase`, canónica por locale, `alternates.languages` + `x-default`, OG/Twitter) (dep T013)
- [x] T022 [P] `components/seo/JsonLd.tsx` (escape de `<`) + `lib/seo/jsonld.ts` (`schema-dts`, `@graph`, `@id`)
- [x] T023 [P] `app/sitemap.ts` (todas las rutas + `alternates.languages`)
- [x] T024 [P] `app/robots.ts` (permite crawlers de IA; host; sitemap)
- [x] T025 [P] `public/llms.txt` (estructura base; se completa en US5)
- [x] T026 [P] `app/[locale]/opengraph-image.tsx` (`ImageResponse`, fuente vía `fetch().arrayBuffer()`)

### Motion, shell, seguridad y carga

- [x] T027 [P] `components/motion/` (`gsap.ts` registra plugins en cliente; `useReveal` con `ScrollTrigger.batch`+`matchMedia`; `useParallax` con `quickTo`) (dep T005)
- [x] T028 [P] `components/layout/Nav.tsx` (sticky glass, una línea, ≤72px, CTA "Hablemos") + `components/layout/Footer.tsx`
- [x] T029 [P] `components/i18n/LocaleSwitcher.tsx` + `components/theme/ThemeToggle.tsx` (esqueleto)
- [x] T030 [P] Arnés de pruebas: `vitest.config.ts`, `playwright.config.ts` (+ `@axe-core/playwright`), Lighthouse CI en `tests/`
- [x] T031 [P] **Seguridad**: cabeceras + CSP en `next.config.ts` (HSTS, `X-Content-Type-Options: nosniff`, control de framing, `Referrer-Policy`, `Permissions-Policy`; CSP permite solo orígenes de Calendly) [FR-031]
- [x] T032 [P] **Carga**: convención de UI de carga: `app/[locale]/loading.tsx` + patrón `Suspense`/skeleton reutilizable en `components/ui/Skeleton*` [FR-036]

**Checkpoint**: Fundación lista (incluye seguridad y carga). Las historias pueden comenzar.

---

## Phase 3: User Story 1 - Dueño de PYME agenda/solicita un servicio (Priority: P1) 🎯 MVP

**Goal**: Ruta comercial completa: familias/paquetes orientados a conversión + contacto multicanal
con diagnóstico, formulario, anti-spam sin estado y confirmación.

**Independent Test**: abrir `/es/servicios/[familia]`, verificar gancho→qué recibes→resultado→CTA, y
completar un envío que llega y confirma (o abre Calendly). Alcanzable por nav sin depender de la home.

- [x] T033 [P] [US1] Familias/paquetes ES en `content/es/servicios/{automatizacion-ia,plataformas,sitios,soporte}.ts` (copy real)
- [x] T034 [P] [US1] Stubs EN en `content/en/servicios/{...}.ts` (TODO traducir)
- [x] T035 [P] [US1] Esquema zod compartido `lib/contact-schema.ts` (nombre, email, tipo, mensaje)
- [x] T036 [US1] `lib/contact.ts` (`processContact`: honeypot → time-trap → `safeParse` → Resend; **sin Redis/rate-limit en la app**) (dep T035) [contracts/contact.md]
- [x] T037 [US1] Server Action `app/actions/contact.ts` (dep T036)
- [x] T038 [P] [US1] `components/contact/ContactForm.tsx` (RHF + shadcn, honeypot/`startedAt` fuera del schema, estados éxito/error `aria-live`, pending) (dep T035)
- [x] T039 [P] [US1] `components/contact/ChannelButtons.tsx` (`wa.me` dígitos, `tel:` E.164, `mailto:`, LinkedIn; `rel="noopener noreferrer"`)
- [x] T040 [P] [US1] `components/contact/CalendlyPopup.tsx` (carga diferida por clic + fallback + estado de carga + focus trap)
- [x] T041 [US1] `components/services/PackageCard.tsx` + `FamilyView.tsx` (problema→qué recibes→resultado→CTA; sin precios)
- [x] T042 [US1] Índice `app/[locale]/servicios/page.tsx` (dep T018, T041)
- [x] T043 [US1] Familia `app/[locale]/servicios/[familia]/page.tsx` (`generateStaticParams`, `generateMetadata`, JSON-LD `Service`/`Offer`/`FAQPage`) (dep T041, T021, T022)
- [x] T044 [US1] Contacto `app/[locale]/contacto/page.tsx` (ContactForm + ChannelButtons + Calendly, con loading) (dep T037, T038, T039, T040)
- [x] T045 [US1] CTA único **"Agenda tu diagnóstico gratis"** en páginas comerciales → Calendly (dep T040)
- [x] T046 [P] [US1] Unit tests de `lib/contact` y `contact-schema` en `tests/unit/contact.test.ts` (dep T036)
- [x] T047 [US1] E2E + axe en `tests/e2e/us1-servicios-contacto.spec.ts` (paquete visible; envío válido/inválido/honeypot; diagnóstico abre) (dep T044)

**Checkpoint**: US1 funcional e independiente (MVP comercial).

---

## Phase 4: User Story 2 - Reclutador/CTO evalúa para contratar (Priority: P1)

**Goal**: Home one-pager premium (hero nombre + formas 3D, bifurcación dual, métricas, banda IA) +
perfil con prueba y CTA de contratación.

**Independent Test**: entrar por la home, seguir "para equipos que contratan" al perfil y a contacto
en ≤2 clics; el perfil comunica rol/stack/experiencia/liderazgo.

- [x] T048 [P] [US2] Perfil ES `content/es/perfil.ts` (bio, título, stack, experiencia, métricas, enlaces del CV)
- [x] T049 [P] [US2] Stub EN `content/en/perfil.ts` (TODO traducir)
- [x] T050 [P] [US2] `components/hero/NameSplit.tsx` (`SplitText` sobre `<h1>`, `aria:"auto"`, `mask:"lines"`, LCP no oculto) (dep T027)
- [x] T051 [P] [US2] `components/hero/ShapesLayer.tsx` (CSS `preserve-3d`: 2 cubos canto cobre, anillo, orbe; GSAP `rotation` + `quickTo`; pausa offscreen) (dep T027)
- [x] T052 [US2] `components/hero/Hero.tsx` (eyebrow mono, nombre, subtítulo ≤20 palabras, CTAs "Hablemos"/"Ver proyectos"; `min-h-[100dvh]`) (dep T050, T051)
- [x] T053 [P] [US2] `components/home/DualPaths.tsx` (split 50/50 contratan/negocios)
- [x] T054 [P] [US2] `components/home/Metrics.tsx` (cifras Geist Mono, contadores animados) (dep T027)
- [x] T055 [P] [US2] `components/home/AIBand.tsx` (bloque de color marino-negro, 3 pasos nombrados por su acción)
- [x] T056 [US2] Home `app/[locale]/(home)/page.tsx` (Hero + DualPaths + Metrics + AIBand + teasers) (dep T052-T055)
- [x] T057 [US2] Perfil `app/[locale]/perfil/page.tsx` (bio, stack, experiencia, métricas, enlaces, CTA contratación) (dep T048, T018)
- [x] T058 [US2] JSON-LD `Person` (`@graph`, `sameAs`) en home y perfil (dep T022, T048)
- [x] T059 [US2] E2E + axe `tests/e2e/us2-home-perfil.spec.ts` (bifurcación → perfil → contacto ≤2 clics) (dep T056, T057)

**Checkpoint**: US1 + US2 independientes (MVP dual completo).

---

## Phase 5: User Story 3 - Visitante explora los proyectos (Priority: P2)

**Goal**: Listado y detalle de 4 casos (3 reales + este portafolio), gestionables como MDX.

**Independent Test**: abrir `/es/proyectos`, ver los casos ("próximamente" distinguidos), abrir un
detalle con problema→solución→resultado, stack, capturas y enlaces.

- [x] T060 [P] [US3] Casos ES en `content/es/proyectos/{windmar-plataforma,simulacion-financiera,web-2-0,este-portafolio}.mdx` (**incluye el propio portafolio** como proyecto personal; puede empezar `coming-soon` y finalizarse en T103)
- [x] T061 [P] [US3] Stubs EN `content/en/proyectos/{...}.mdx` (TODO traducir)
- [x] T062 [P] [US3] `components/projects/ProjectCard.tsx` (glass, slot de imagen `picsum` seed + `alt`, estado "próximamente")
- [x] T063 [US3] Índice `app/[locale]/proyectos/page.tsx` (rejilla con ritmo, mismo peso visual) (dep T062, T018)
- [x] T064 [US3] Detalle `app/[locale]/proyectos/[slug]/page.tsx` (render MDX, `generateStaticParams`, JSON-LD `CreativeWork`) (dep T019, T022)
- [x] T065 [US3] E2E + axe `tests/e2e/us3-proyectos.spec.ts` (listado + detalle + "próximamente") (dep T064)

**Checkpoint**: US1-US3 independientes.

---

## Phase 6: User Story 4 - Uso del sitio en el idioma del visitante (Priority: P2)

**Goal**: Bilingüe real con paridad garantizada (los pathnames localizados ya están en T009).

**Independent Test**: cambiar ES↔EN en varias páginas; todo se traduce, la URL refleja el idioma y se
mantiene la página equivalente; `check:content` pasa.

- [ ] T066 [US4] `LocaleSwitcher` mantiene la página equivalente (mapear por id/pathname de T009) (dep T029, T009)
- [ ] T067 [US4] Completar traducciones EN de `messages/en.json` y contenido `published` (perfil, servicios, proyectos) (dep T014, T033, T048, T060)
- [ ] T068 [US4] `hreflang` + `x-default` verificados en todas las rutas (dep T021)
- [ ] T069 [US4] Reforzar paridad en `scripts/check-content.ts` (un `published` sin EN falla el build) (dep T020, T067)
- [ ] T070 [US4] E2E `tests/e2e/us4-i18n.spec.ts` (toggle mantiene página; sin texto del idioma opuesto) + `check:content` en CI (dep T066)

**Checkpoint**: Sitio bilingüe con paridad garantizada.

---

## Phase 7: User Story 5 - Posicionamiento en buscadores y LLMs (Priority: P2)

**Goal**: Completar y consolidar SEO/GEO. **Cada historia ya crea SU metadata/JSON-LD** (US1 Service,
US2 Person, US3 CreativeWork); US5 solo completa rutas faltantes y enlaza el grafo.

**Independent Test**: metadatos/JSON-LD por tipo; `sitemap.xml`/`robots.txt`/`llms.txt` 200 sin
redirección; cada familia/proyecto con URL indexable.

- [x] T071 [US5] `generateMetadata` en rutas restantes (contacto, índices de servicios/proyectos) que no cubrieron las historias (dep T021)
- [x] T072 [US5] Consolidar y ENLAZAR el `@graph` con `@id` (`Person` como `provider` de `Service`); no rehacer el JSON-LD de US1/US2/US3 (dep T043, T058, T064)
- [x] T073 [US5] Completar `app/sitemap.ts` con todas las rutas reales + alternates (dep T023, T009)
- [x] T074 [US5] `robots.ts`: permitir `GPTBot`/`OAI-SearchBot`/`ClaudeBot`/`PerplexityBot`/`Google-Extended` + host + sitemap (dep T024)
- [x] T075 [US5] Contenido real de `public/llms.txt` (perfil, servicios, proyectos; priorizar EN) (dep T025, T067)
- [x] T076 [US5] OG images por tipo de página (dep T026)
- [x] T077 [US5] Consistencia de entidad `sameAs` (mismo nombre/bio/enlaces que LinkedIn/GitHub) (dep T058)
- [x] T078 [US5] AEO: H2 en forma de pregunta + `FAQPage` visible donde sea real (servicios) (dep T043)
- [x] T079 [US5] E2E/SEO `tests/e2e/us5-seo.spec.ts` (metadata, hreflang, JSON-LD válido, sitemap/robots/llms 200 sin redirección) (dep T071-T075)

**Checkpoint**: Descubrible y citable; superficie indexable por tema.

---

## Phase 8: User Story 6 - Tema claro/oscuro (Priority: P3)

**Goal**: Alternar tema sin parpadeo, persistente, con contraste AA en ambos.

- [ ] T080 [US6] Finalizar anti-FOUC de `next-themes` (script/estrategia de clase) (dep T016)
- [ ] T081 [US6] UX del `ThemeToggle` (icono Phosphor, `aria-label`, teclado) (dep T029)
- [ ] T082 [US6] Verificar contraste AA en ambos temas (texto/enlaces con variantes AA del cobre) (dep T015)
- [ ] T083 [US6] `color-scheme` y controles nativos por tema (dep T015)
- [ ] T084 [US6] E2E `tests/e2e/us6-tema.spec.ts` (persistencia sin flash + axe en ambos temas) (dep T080)

**Checkpoint**: Todas las historias independientes y funcionales.

---

## Phase 9: Polish & Cross-Cutting Concerns

- [ ] T085 [P] Micro-física magnética del CTA en `components/ui/MagneticButton.tsx` (desktop + `no-preference`)
- [ ] T086 [P] Ajuste fino de formas del hero (pausa offscreen, `will-change` con moderación)
- [ ] T087 Auditoría reduced-motion (todo el motion bajo `gsap.matchMedia()` colapsa a estático)
- [ ] T088 [P] Regresión visual Playwright en 320/768/1024/1440, ambos temas, en `tests/visual/`
- [ ] T089 Auditoría de accesibilidad (agente a11y + axe): teclado, foco, contraste; corregir AA
- [ ] T090 Lighthouse CI: LCP<2.5s, INP<200ms, CLS<0.1; JS de home <150KB gz
- [ ] T091 Análisis de bundle (`@next/bundle-analyzer`) + `next/dynamic` para lo below-the-fold
- [ ] T092 **Auditoría de carga**: toda operación async con loading/skeleton (SC-012); `loading.tsx` por segmento verificado (dep T032)
- [ ] T093 Imágenes: slots reales, `picsum` seed provisional, `next/image` `priority` solo en LCP
- [ ] T094 Auto-auditoría de copy: cero em-dash, sin AI-tells, un registro (design-system §10)
- [ ] T095 Pasar el gate de UX por vista ([checklists/ux-design.md](./checklists/ux-design.md))
- [ ] T096 [P] Iconos: reemplazar `lucide-react` de shadcn por Phosphor (una sola familia)
- [ ] T097 **Verificación de seguridad**: CSP + cabeceras presentes en respuestas; cero secretos en el bundle cliente (SC-011); scan de cabeceras (dep T031)
- [ ] T098 Revisión de seguridad (agente security-reviewer): env, anti-spam sin estado, CSP para Calendly, `rel=noopener`, dependencias
- [ ] T099 [P] Docs: `README.md` + guía de edición de contenido (ref. [contracts/content.md](./contracts/content.md))
- [ ] T100 Ejecutar validación completa de [quickstart.md](./quickstart.md)
- [ ] T101 Revisión de código (agente code-reviewer): corregir CRITICAL/HIGH
- [ ] T102 Config de despliegue en Vercel (env vars, build, cabeceras) + deploy de preview
- [ ] T103 Finalizar el caso `este-portafolio` (capturas reales + narrativa) tras el deploy y marcar `published` (dep T102)
- [ ] T104 Re-validar Constitution Check (v1.2.0, 7 principios) y checklists en verde

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup. BLOQUEA todas las historias (incluye seguridad T031 y carga T032).
- **User Stories (Phase 3-8)**: dependen de Foundational. US1 y US2 (P1) primero; luego US3/US4/US5 (P2); US6 (P3).
- **Polish (Phase 9)**: depende de las historias deseadas completas.

### User Story Dependencies

- **US1 (P1)**: tras Foundational. Independiente (rutas `/servicios`, `/contacto` por nav).
- **US2 (P1)**: tras Foundational. Independiente (home + perfil). Reutiliza contacto de US1 si existe.
- **US3 (P2)**: tras Foundational. Independiente. Incluye el portafolio como caso.
- **US4 (P2)**: tras Foundational; los pathnames ya están en T009, aquí se completan traducciones y paridad.
- **US5 (P2)**: tras Foundational; consolida/enlaza metadata y JSON-LD ya creados por las historias.
- **US6 (P3)**: tras Foundational (provider de tema).

### Within Each User Story

Contenido/esquemas → componentes → rutas → E2E. Cada historia crea su propia metadata/JSON-LD (US5 no
las rehace, solo completa y enlaza).

### Parallel Opportunities

- Setup: T002-T007 en paralelo.
- Foundational: T009-T011, T014, T015, T017, T021-T032 en paralelo (distintos archivos).
- Tras la fundación, US1 y US2 pueden ir en paralelo.
- US1: T033/T034/T035, T038/T039/T040 en paralelo. US2: T048/T049, T050/T051, T053/T054/T055.

---

## Implementation Strategy

### MVP First (US1 + US2, ambas P1)

1. Phase 1: Setup → 2. Phase 2: Foundational (CRÍTICO) → 3. US1 (comercial) → validar →
4. US2 (home + perfil) → validar → **STOP y VALIDAR**: conversión dual funcionando; deploy de preview.

### Incremental Delivery

Setup + Foundational → US1 (MVP comercial) → US2 (MVP dual) → US3 (proyectos, incl. portafolio) →
US4 (bilingüe pleno) → US5 (SEO/GEO) → US6 (tema) → Polish (seguridad, carga, CWV, deploy).

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes.
- **Sin base de datos**: contenido en archivos; anti-spam sin estado (honeypot + time-trap); rate
  limiting opcional a nivel de plataforma (Vercel).
- **Seguridad** (T031, T097, T098) y **carga** (T032, T092) son transversales y con puertas propias.
- El gate de UX ([checklists/ux-design.md](./checklists/ux-design.md)) se aplica por vista en cada historia.
- El contenido nace en español; las traducciones EN de ítems `published` son obligatorias (US4) o el build falla.
- Commit tras cada tarea o grupo lógico; `check:content` y `typecheck` antes de commits de contenido/tipos.
