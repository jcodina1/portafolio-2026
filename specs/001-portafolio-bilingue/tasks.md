---
description: "Task list for Portafolio bilingüe implementation"
---

# Tasks: Portafolio bilingüe (perfil + venta de servicios a PYMEs)

**Input**: Design documents from `specs/001-portafolio-bilingue/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md),
[data-model.md](./data-model.md), [contracts/](./contracts/), [design-system.md](./design-system.md)

**Tests**: INCLUIDOS. La constitución (puertas de calidad: WCAG AA, Core Web Vitals, paridad i18n) y
las reglas de testing web exigen accesibilidad automatizada, regresión visual y Lighthouse. Se usa un
enfoque pragmático: unit (esquemas zod, `lib/contact`), E2E + axe por historia, regresión visual y
CWV en Polish. No TDD estricto por componente (la regresión visual da más señal en UI).

**Organización**: por historia de usuario para implementación y validación independientes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: puede correr en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: US1-US6 (mapea a las historias del spec)
- Rutas de archivo exactas en cada tarea. Stack/estructura: ver [plan.md](./plan.md).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar el proyecto Next.js 16 y sus dependencias.

- [ ] T001 Inicializar proyecto Next.js 16 (App Router, TypeScript, Turbopack, React 19) en la raíz del repo
- [ ] T002 [P] Configurar Tailwind CSS v4 (`@tailwindcss/postcss`, `app/globals.css` con `@import "tailwindcss"`)
- [ ] T003 [P] Inicializar shadcn/ui (`npx shadcn@latest init`) y añadir base (`button card input textarea label form dialog`) en `components/ui/`
- [ ] T004 [P] Configurar TypeScript strict, ESLint y Prettier (`tsconfig.json`, `eslint.config.mjs`, `.prettierrc`)
- [ ] T005 [P] Instalar dependencias núcleo: `next-intl gsap @gsap/react next-themes zod react-hook-form @hookform/resolvers resend @upstash/ratelimit @upstash/redis geist @phosphor-icons/react @next/mdx gray-matter react-calendly schema-dts`
- [ ] T006 [P] Configurar fuentes en `app/fonts.ts` (Geist + Geist Mono vía `geist`; Clash Display vía `next/font/local` con woff2 subset Latin-1 en `public/fonts/`)
- [ ] T007 [P] Crear `.env.example` con todas las variables (ver [contracts/contact.md](./contracts/contact.md)); añadir `.env.local` a `.gitignore` (ya cubierto)
- [ ] T008 Configurar scripts en `package.json` (`dev`, `build`, `prebuild=check:content`, `typecheck`, `test`, `test:e2e`, `lhci`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura compartida que DEBE existir antes de cualquier historia: i18n, tokens/tema,
modelo de contenido, SEO base, primitivas de motion, shell de layout y arnés de pruebas.

**⚠️ CRITICAL**: ninguna historia de usuario puede empezar hasta completar esta fase.

### i18n (routing SSG)

- [ ] T009 [P] Config de routing i18n en `i18n/routing.ts` (locales `es`/`en`, default `es`, `localePrefix: 'always'`)
- [ ] T010 [P] Config de request en `i18n/request.ts` (`getRequestConfig` carga `messages/{locale}.json`)
- [ ] T011 [P] Navegación tipada en `i18n/navigation.ts` (`createNavigation(routing)`)
- [ ] T012 Middleware en `middleware.ts` (`createMiddleware` + matcher que EXCLUYE `_next`, `api`, `sitemap.xml`, `robots.txt`, `llms.txt`) (depende T009)
- [ ] T013 Layout de locale en `app/[locale]/layout.tsx` (`setRequestLocale`, `generateStaticParams`, `<html lang>` + `suppressHydrationWarning`, clases de fuentes, providers) (depende T006, T009-T011)
- [ ] T014 [P] Mensajes UI base en `messages/es.json` y `messages/en.json` (nav, CTAs, labels de formulario, estados)

### Tokens de diseño y tema

- [ ] T015 [P] Tokens en `app/globals.css` (3 capas: primitivos → semánticos `:root`/`.dark` → `@theme inline`; `@custom-variant dark`; `color-scheme`; variantes AA del cobre) (depende T002) [design-system §2]
- [ ] T016 Providers cliente en `app/providers.tsx` (`next-themes` `attribute="class"`, `disableTransitionOnChange`) y cablearlos en el layout (depende T013)

### Modelo de contenido

- [ ] T017 [P] Esquemas zod en `content/schema.ts` (profile, project, serviceFamily, servicePackage, helper `localized`) (depende T005) [data-model.md]
- [ ] T018 [P] Loaders en `lib/content/{profile,services,projects}.ts` (patrón repositorio; `gray-matter` para MDX) (depende T017)
- [ ] T019 Config MDX en `next.config.ts` (`createMDX`) + `mdx-components.tsx` (componentes MDX permitidos) (depende T001)
- [ ] T020 Script de validación en `scripts/check-content.ts` (parse zod + paridad ES/EN + paridad de slugs) y cablear `prebuild` (depende T017, T018)

### SEO/GEO base

- [ ] T021 [P] Helper de metadata en `lib/seo/metadata.ts` (`metadataBase`, canónica por locale, `alternates.languages` + `x-default`, OG/Twitter) (depende T013) [research §1.2]
- [ ] T022 [P] Componente `components/seo/JsonLd.tsx` (escape de `<`) + builders `lib/seo/jsonld.ts` (`schema-dts`, `@graph`, `@id`) [research §1.3]
- [ ] T023 [P] `app/sitemap.ts` (todas las rutas con `alternates.languages`)
- [ ] T024 [P] `app/robots.ts` (permite crawlers de IA; host; sitemap)
- [ ] T025 [P] `public/llms.txt` (estructura base, se completa en US5)
- [ ] T026 [P] OG dinámico en `app/[locale]/opengraph-image.tsx` (`ImageResponse`, fuente vía `fetch().arrayBuffer()`)

### Motion y shell de layout

- [ ] T027 [P] Primitivas de motion en `components/motion/` (`gsap.ts` registra plugins en cliente; `useReveal` con `ScrollTrigger.batch`+`matchMedia`; `useParallax` con `quickTo`) (depende T005) [design-system §5]
- [ ] T028 [P] Nav sticky glass en `components/layout/Nav.tsx` (una línea, ≤72px, CTA "Hablemos") + `components/layout/Footer.tsx`
- [ ] T029 [P] `components/i18n/LocaleSwitcher.tsx` + `components/theme/ThemeToggle.tsx` (esqueleto; lógica fina en US4/US6)
- [ ] T030 [P] Arnés de pruebas: `vitest.config.ts`, `playwright.config.ts` (+ `@axe-core/playwright`), config Lighthouse CI en `tests/`

**Checkpoint**: Fundación lista. Las historias pueden comenzar (en paralelo si hay capacidad).

---

## Phase 3: User Story 1 - Dueño de PYME agenda/solicita un servicio (Priority: P1) 🎯 MVP

**Goal**: Ruta comercial completa: familias/paquetes de servicio orientados a conversión + contacto
multicanal con diagnóstico, formulario, anti-spam y confirmación.

**Independent Test**: abrir `/es/servicios/[familia]`, verificar gancho→qué recibes→resultado→CTA, y
completar un envío de contacto que llega y confirma (o abre Calendly). Reachable vía nav sin depender
de la home.

### Contenido (datos)

- [ ] T031 [P] [US1] Familias/paquetes ES en `content/es/servicios/{automatizacion-ia,plataformas,sitios,soporte}.ts` (copy real del autor) [contracts/content.md]
- [ ] T032 [P] [US1] Stubs EN en `content/en/servicios/{...}.ts` (marcados TODO hasta traducir)

### Contacto (lib + acción)

- [ ] T033 [P] [US1] Esquema zod compartido en `lib/contact-schema.ts` (nombre, email, tipo, mensaje)
- [ ] T034 [US1] Lógica pura en `lib/contact.ts` (`processContact`: honeypot → time-trap → `@upstash/ratelimit` → `safeParse` → Resend) (depende T033) [contracts/contact.md]
- [ ] T035 [US1] Server Action en `app/actions/contact.ts` (wrapper de `processContact`) (depende T034)

### Componentes

- [ ] T036 [P] [US1] `components/contact/ContactForm.tsx` (RHF + shadcn Form, honeypot y `startedAt` fuera del schema, estados éxito/error `aria-live`) (depende T033)
- [ ] T037 [P] [US1] `components/contact/ChannelButtons.tsx` (`wa.me` solo dígitos, `tel:` E.164, `mailto:` corto, LinkedIn; `rel="noopener noreferrer"`, `aria-label`)
- [ ] T038 [P] [US1] `components/contact/CalendlyPopup.tsx` (carga diferida por clic + enlace fallback; focus trap) [research §4.5]
- [ ] T039 [US1] `components/services/PackageCard.tsx` + `components/services/FamilyView.tsx` (problema→qué recibes→resultado→CTA; sin precios) [design-system §7]

### Rutas

- [ ] T040 [US1] Índice de servicios `app/[locale]/servicios/page.tsx` (lista de familias) (depende T018, T039)
- [ ] T041 [US1] Familia `app/[locale]/servicios/[familia]/page.tsx` (`generateStaticParams`, `generateMetadata`, JSON-LD `Service`/`Offer`/`FAQPage`) (depende T039, T021, T022)
- [ ] T042 [US1] Contacto `app/[locale]/contacto/page.tsx` (ContactForm + ChannelButtons + Calendly) (depende T035, T036, T037, T038)
- [ ] T043 [US1] Cablear CTA "Agenda tu diagnóstico gratis" en páginas comerciales → Calendly (depende T038)

### Pruebas

- [ ] T044 [P] [US1] Unit tests de `lib/contact` y `contact-schema` en `tests/unit/contact.test.ts` (honeypot, time-trap, validación) (depende T034)
- [ ] T045 [US1] E2E + axe en `tests/e2e/us1-servicios-contacto.spec.ts` (paquete visible; envío válido/ inválido/honeypot; diagnóstico abre) (depende T042)

**Checkpoint**: US1 funcional e independientemente testeable (MVP comercial).

---

## Phase 4: User Story 2 - Reclutador/CTO evalúa para contratar (Priority: P1)

**Goal**: Home one-pager premium con hero (nombre gigante + formas 3D), bifurcación dual, métricas y
banda IA; y página de perfil con prueba y CTA de contratación.

**Independent Test**: entrar por la home, seguir "para equipos que contratan" al perfil y a una vía de
contacto en ≤2 clics; el perfil comunica rol/stack/experiencia/liderazgo.

### Contenido

- [ ] T046 [P] [US2] Perfil ES en `content/es/perfil.ts` (bio, título, stack, experiencia, métricas, enlaces reales del CV)
- [ ] T047 [P] [US2] Stub EN en `content/en/perfil.ts` (TODO traducir)

### Componentes de hero y home

- [ ] T048 [P] [US2] `components/hero/NameSplit.tsx` (`SplitText` sobre `<h1>`, `aria:"auto"`, `mask:"lines"`, LCP no oculto) (depende T027) [design-system §5]
- [ ] T049 [P] [US2] `components/hero/ShapesLayer.tsx` (CSS `preserve-3d`: 2 cubos con canto cobre, anillo, orbe; GSAP `rotation` + `quickTo` parallax; pausa offscreen) (depende T027)
- [ ] T050 [US2] `components/hero/Hero.tsx` (eyebrow mono, nombre, subtítulo ≤20 palabras, CTAs "Hablemos"/"Ver proyectos"; `min-h-[100dvh]`) (depende T048, T049)
- [ ] T051 [P] [US2] `components/home/DualPaths.tsx` (split 50/50 contratan/negocios, no 3 cards iguales)
- [ ] T052 [P] [US2] `components/home/Metrics.tsx` (cifras Geist Mono, contadores animados al entrar) (depende T027)
- [ ] T053 [P] [US2] `components/home/AIBand.tsx` (bloque de color marino-negro, 3 pasos nombrados por su acción)

### Rutas

- [ ] T054 [US2] Home `app/[locale]/(home)/page.tsx` (Hero + DualPaths + Metrics + AIBand + teasers de proyectos/servicios) (depende T050-T053)
- [ ] T055 [US2] Perfil `app/[locale]/perfil/page.tsx` (bio, stack, experiencia, métricas, enlaces, CTA contratación) (depende T046, T018)
- [ ] T056 [US2] JSON-LD `Person` (`@graph`, `sameAs`) en home y perfil (depende T022, T046)

### Pruebas

- [ ] T057 [US2] E2E + axe en `tests/e2e/us2-home-perfil.spec.ts` (bifurcación → perfil → contacto ≤2 clics; contenido presente) (depende T054, T055)

**Checkpoint**: US1 + US2 funcionan de forma independiente (MVP dual completo).

---

## Phase 5: User Story 3 - Visitante explora los proyectos (Priority: P2)

**Goal**: Listado y detalle de 3 casos reales como prueba de competencia, gestionables como MDX.

**Independent Test**: abrir `/es/proyectos`, ver los 3 casos (y "próximamente" distinguidos), abrir un
detalle con problema→solución→resultado, stack, capturas y enlaces.

- [ ] T058 [P] [US3] Casos ES en `content/es/proyectos/{windmar-plataforma,simulacion-financiera,web-2-0}.mdx` (front-matter + narrativa real)
- [ ] T059 [P] [US3] Stubs EN en `content/en/proyectos/{...}.mdx` (TODO traducir)
- [ ] T060 [P] [US3] `components/projects/ProjectCard.tsx` (glass, slot de imagen con `picsum` seed + `alt`, estado "próximamente") [design-system §4]
- [ ] T061 [US3] Índice `app/[locale]/proyectos/page.tsx` (rejilla con ritmo, mismo peso visual) (depende T060, T018)
- [ ] T062 [US3] Detalle `app/[locale]/proyectos/[slug]/page.tsx` (render MDX, `generateStaticParams`, JSON-LD `CreativeWork`) (depende T019, T022)
- [ ] T063 [US3] E2E + axe en `tests/e2e/us3-proyectos.spec.ts` (listado + detalle + "próximamente") (depende T062)

**Checkpoint**: US1-US3 independientes.

---

## Phase 6: User Story 4 - Uso del sitio en el idioma del visitante (Priority: P2)

**Goal**: Experiencia bilingüe real: rutas localizadas, cambio de idioma manteniendo la página
equivalente, paridad de contenido garantizada.

**Independent Test**: cambiar ES↔EN en varias páginas; todo se traduce, la URL refleja el idioma y se
mantiene la página equivalente; `pnpm check:content` pasa.

- [ ] T064 [US4] Pathnames localizados en `i18n/routing.ts` (`proyectos`↔`projects`, `servicios`↔`services`, `perfil`↔`profile`, `contacto`↔`contact`) (depende T009)
- [ ] T065 [US4] Completar traducciones EN de `messages/en.json` y del contenido `published` (perfil, servicios, proyectos) (depende T014, T031, T046, T058)
- [ ] T066 [US4] `LocaleSwitcher` mantiene la página equivalente (mapear por id/pathname) (depende T029, T064)
- [ ] T067 [US4] `hreflang` + `x-default` verificados en todas las rutas (depende T021)
- [ ] T068 [US4] Reforzar paridad en `scripts/check-content.ts` (un `published` sin EN falla el build) (depende T020, T065)
- [ ] T069 [US4] E2E en `tests/e2e/us4-i18n.spec.ts` (toggle mantiene página; sin texto del idioma opuesto) + `check:content` en CI (depende T066)

**Checkpoint**: Sitio bilingüe con paridad garantizada.

---

## Phase 7: User Story 5 - Posicionamiento en buscadores y LLMs (Priority: P2)

**Goal**: SEO técnico completo + GEO: metadatos y datos estructurados por tipo, sitemap/robots/llms,
consistencia de entidad, contenido orientado a respuestas.

**Independent Test**: inspeccionar metadatos/JSON-LD por tipo de página; `sitemap.xml`/`robots.txt`/
`llms.txt` responden 200 sin redirección; cada familia/proyecto tiene URL indexable.

- [ ] T070 [US5] `generateMetadata` en TODAS las rutas (home, perfil, servicios, familia, proyectos, slug, contacto) (depende T021)
- [ ] T071 [US5] Ensamblar JSON-LD `@graph` por tipo con `@id` enlazados (`Person` como `provider` de `Service`) (depende T022, T056)
- [ ] T072 [US5] Completar `app/sitemap.ts` con todas las rutas reales + alternates (depende T023, T064)
- [ ] T073 [US5] `robots.ts`: permitir `GPTBot`/`OAI-SearchBot`/`ClaudeBot`/`PerplexityBot`/`Google-Extended` + host + sitemap (depende T024)
- [ ] T074 [US5] Contenido real de `public/llms.txt` (perfil, servicios, proyectos; priorizar EN) (depende T025, T065)
- [ ] T075 [US5] OG images por tipo de página (depende T026)
- [ ] T076 [US5] Consistencia de entidad `sameAs` (mismo nombre/bio/enlaces que LinkedIn/GitHub) (depende T056)
- [ ] T077 [US5] AEO: H2 en forma de pregunta + `FAQPage` visible donde sea real (servicios) (depende T041)
- [ ] T078 [US5] E2E/SEO en `tests/e2e/us5-seo.spec.ts` (metadata, hreflang, JSON-LD válido, sitemap/robots/llms 200 sin redirección) (depende T070-T074)

**Checkpoint**: Descubrible y citable; superficie indexable por tema.

---

## Phase 8: User Story 6 - Tema claro/oscuro (Priority: P3)

**Goal**: Alternar tema sin parpadeo, con preferencia persistente y contraste AA en ambos.

**Independent Test**: alternar tema (persiste, sin flash inicial); contraste AA verificado en ambos.

- [ ] T079 [US6] Finalizar anti-FOUC de `next-themes` (script bloqueante / estrategia de clase) (depende T016)
- [ ] T080 [US6] UX del `ThemeToggle` (icono Phosphor, `aria-label`, operable por teclado) (depende T029)
- [ ] T081 [US6] Verificar contraste AA en ambos temas (texto/enlaces usan variantes AA del cobre) (depende T015)
- [ ] T082 [US6] `color-scheme` y estilos de controles nativos por tema (depende T015)
- [ ] T083 [US6] E2E en `tests/e2e/us6-tema.spec.ts` (persistencia sin flash + axe en ambos temas) (depende T079)

**Checkpoint**: Todas las historias independientes y funcionales.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Pulido transversal, gates de calidad, rendimiento y despliegue.

- [ ] T084 [P] Micro-física magnética del CTA principal en `components/ui/MagneticButton.tsx` (solo desktop + `no-preference`)
- [ ] T085 [P] Ajuste fino de formas del hero (pausa offscreen, `will-change` con moderación)
- [ ] T086 Auditoría reduced-motion: todo el motion bajo `gsap.matchMedia()` colapsa a estático
- [ ] T087 [P] Regresión visual Playwright en 320/768/1024/1440, ambos temas, en `tests/visual/`
- [ ] T088 Auditoría de accesibilidad completa (agente a11y + axe): teclado, foco, contraste; corregir AA
- [ ] T089 Lighthouse CI: LCP<2.5s, INP<200ms, CLS<0.1; JS de home <150KB gz (depende US completas)
- [ ] T090 Análisis de bundle (`@next/bundle-analyzer`) + `next/dynamic` para lo below-the-fold
- [ ] T091 Imágenes: slots de captura real, `picsum` seed provisional, `next/image` `priority` solo en LCP
- [ ] T092 Auto-auditoría de copy: cero em-dash, sin AI-tells, un solo registro (design-system §10)
- [ ] T093 Pasar el gate de UX por vista ([checklists/ux-design.md](./checklists/ux-design.md))
- [ ] T094 [P] Iconos: reemplazar `lucide-react` de shadcn por Phosphor (una sola familia)
- [ ] T095 Revisión de seguridad (agente security-reviewer): env vars, anti-spam, CSP para Calendly, headers de seguridad
- [ ] T096 [P] Docs: `README.md` + guía de edición de contenido (referencia a [contracts/content.md](./contracts/content.md))
- [ ] T097 Ejecutar validación completa de [quickstart.md](./quickstart.md)
- [ ] T098 Revisión de código (agente code-reviewer): corregir CRITICAL/HIGH
- [ ] T099 Config de despliegue en Vercel (env vars de Production/Preview, build) + deploy de preview
- [ ] T100 Re-validar Constitution Check (7 principios) y checklists en verde

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias.
- **Foundational (Phase 2)**: depende de Setup. BLOQUEA todas las historias.
- **User Stories (Phase 3-8)**: dependen de Foundational. US1 y US2 (P1) primero; luego US3/US4/US5 (P2); US6 (P3).
- **Polish (Phase 9)**: depende de las historias deseadas completas.

### User Story Dependencies

- **US1 (P1)**: tras Foundational. Independiente (rutas `/servicios`, `/contacto` alcanzables por nav).
- **US2 (P1)**: tras Foundational. Independiente (home + perfil). Reutiliza contacto de US1 si está.
- **US3 (P2)**: tras Foundational. Independiente.
- **US4 (P2)**: tras Foundational; se apoya en contenido de US1/US2/US3 para completar traducciones.
- **US5 (P2)**: tras Foundational; consolida metadata/JSON-LD de todas las rutas ya creadas.
- **US6 (P3)**: tras Foundational (provider de tema).

### Within Each User Story

- Contenido/datos y esquemas antes que componentes; componentes antes que rutas; rutas antes que E2E.

### Parallel Opportunities

- Setup: T002-T007 en paralelo.
- Foundational: T009-T011, T014, T015, T017, T021-T027, T028-T030 en paralelo (distintos archivos).
- Una vez lista la fundación, US1 y US2 pueden ir en paralelo (equipos distintos).
- Dentro de US1: T031/T032/T033, T036/T037/T038 en paralelo.
- Dentro de US2: T046/T047, T048/T049, T051/T052/T053 en paralelo.

---

## Parallel Example: User Story 1

```bash
# Contenido y contratos (distintos archivos):
Task T031: "Familias/paquetes ES en content/es/servicios/*.ts"
Task T033: "Esquema zod en lib/contact-schema.ts"
# Componentes (distintos archivos):
Task T036: "ContactForm.tsx"
Task T037: "ChannelButtons.tsx"
Task T038: "CalendlyPopup.tsx"
```

---

## Implementation Strategy

### MVP First (US1 + US2, ambas P1)

1. Phase 1: Setup
2. Phase 2: Foundational (CRÍTICO, bloquea todo)
3. Phase 3: US1 (ruta comercial) → validar
4. Phase 4: US2 (home + perfil) → validar
5. **STOP y VALIDAR**: sitio con conversión dual funcionando; deploy de preview

### Incremental Delivery

Setup + Foundational → US1 (MVP comercial) → US2 (MVP dual) → US3 (proyectos) → US4 (bilingüe pleno) →
US5 (SEO/GEO) → US6 (tema) → Polish. Cada historia añade valor sin romper las anteriores.

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes.
- Cada historia es completable y testeable de forma independiente.
- El gate de UX ([checklists/ux-design.md](./checklists/ux-design.md)) se aplica por vista en cada historia, no solo en Polish.
- Commit tras cada tarea o grupo lógico; ejecutar `check:content` y `typecheck` antes de cada commit de contenido/tipos.
- El contenido nace en español; las traducciones EN de ítems `published` son obligatorias (US4) o el build falla.
- Evitar: tareas vagas, conflictos en el mismo archivo, dependencias cruzadas entre historias que rompan la independencia.
