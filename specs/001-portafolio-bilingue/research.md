# Research: Portafolio bilingüe (Fase 0)

**Feature**: `001-portafolio-bilingue` · **Fecha**: 2026-07-11

Consolidación de la investigación técnica (4 áreas) que resuelve las incógnitas del plan.
Formato por tema: Decisión / Por qué / Alternativas descartadas / Gotchas clave.

## Contexto de versiones (2026)

- **Next.js 16** (App Router, **Turbopack por defecto** — no ejecuta plugins de webpack), **React 19**.
- **Tailwind CSS v4** (configuración en CSS con `@theme`, sin `tailwind.config.js`).
- **shadcn/ui** sobre tokens `oklch` en `:root`/`.dark`.
- Implicación transversal: preferir vías **nativas** (zod + MDX nativo) sobre content-layers basados
  en plugins webpack (contentlayer2, Velite) para no chocar con Turbopack.

---

## Área 1 — i18n, SEO y GEO

### 1.1 Internacionalización (routing)
- **Decisión**: `next-intl` v4 con segmento `app/[locale]/…`, `localePrefix: 'always'` (`/es`, `/en`),
  **pathnames localizados** (`/es/proyectos` ↔ `/en/projects`, `/servicios` ↔ `/services`,
  `/perfil` ↔ `/profile`). Mantener **SSG** con `setRequestLocale(locale)` en cada layout/page y
  `generateStaticParams` en `[locale]`.
- **Por qué**: App Router no trae i18n routing nativo; `next-intl` es la referencia mantenida, con
  RSC, render estático y navegación tipada. SSG es requisito para que buscadores y LLMs lean HTML ya
  renderizado.
- **Alternativas descartadas**: `next-i18next` (atado a pages router); diccionarios a mano (reinventa
  middleware/formato); Paraglide (ecosistema menor, menos patrones SEO listos); dominios por idioma
  (overkill).
- **Gotchas**: el **matcher del middleware** debe excluir `/_next`, `/api`, estáticos **y**
  `sitemap.xml`/`robots.txt`/`llms.txt` (si no, los redirige y Google recibe 404). Olvidar
  `setRequestLocale` fuerza render dinámico y se pierde SSG en silencio. Envolver en
  `NextIntlClientProvider` solo los mensajes que consumen client components. `hreflang` debe incluir
  `x-default`.

### 1.2 SEO técnico
- **Decisión**: Metadata API nativa (`generateMetadata` por página y locale) + `app/sitemap.ts`
  (con `alternates.languages`) + `app/robots.ts` + OG dinámico con `ImageResponse` de `next/og`.
  `metadataBase` fijado al dominio de producción.
- **Por qué**: nativo, type-safe, SSG, cero dependencias; el sitemap emite `hreflang` por entrada
  (recomendación de Google). `ImageResponse` genera OG 1200×630 en el edge sin servicio externo.
- **Alternativas descartadas**: `next-seo` y `next-sitemap` (redundantes con la Metadata API); OG por
  servicio externo/headless (innecesario).
- **Gotchas**: sin `metadataBase` las canónicas/OG salen rotas. **La canónica de cada locale es ella
  misma** (no apuntar todo a EN). Cada entrada de sitemap lista todas las variantes + `x-default`.
  `opengraph-image` corre en edge: cargar fuentes por `fetch().arrayBuffer()`, no `fs`. Twitter:
  `summary_large_image`. En `robots.ts` **no** bloquear crawlers de IA (`GPTBot`, `OAI-SearchBot`,
  `ClaudeBot`, `PerplexityBot`, `Google-Extended`).

### 1.3 Datos estructurados (JSON-LD)
- **Decisión**: JSON-LD como `<script type="application/ld+json">` inyectado desde **Server
  Components** (queda en el HTML/SSG), un helper `<JsonLd>` tipado con `schema-dts`, un único
  `@graph` por página con `@id` estables enlazando entidades. Mapa: `Person` (home + `/perfil`, con
  `sameAs`), `Service`+`Offer` (`/servicios/[familia]`), `CreativeWork` (proyectos),
  `BreadcrumbList` (rutas anidadas), `FAQPage` (donde haya Q&A real y visible).
- **Por qué**: Google recomienda JSON-LD; en RSC va en el HTML servido (visible a crawlers y LLMs);
  `sameAs` ancla la entidad-persona (consistencia / Knowledge Graph).
- **Alternativas descartadas**: microdata/RDFa (verboso); inyección client-side (invisible a
  crawlers).
- **Gotchas**: **escapar `<`** al serializar (anti-XSS: `.replace(/</g,'\\u003c')`). `inLanguage`
  y textos deben coincidir con el locale (paridad también en datos). No marcar `Offer`/`FAQPage` con
  contenido no visible. Sin precio real, describir `Service` **sin** inventar `price`.

### 1.4 GEO / AEO (posicionamiento en LLMs)
- **Decisión**: publicar `llms.txt` en la raíz (coste trivial) **como complemento**, no como palanca
  principal. Palanca real: contenido **SSG en HTML rastreable** + estructura **orientada a
  respuestas** (pregunta en H2, respuesta directa en el primer párrafo, respaldada con `FAQPage`) +
  **consistencia de entidad** (`sameAs` idénticos en web/LinkedIn/GitHub) + permitir crawlers de IA.
- **Por qué (evidencia)**: Google confirma que **no** usa `llms.txt` y ~97% de esos archivos
  reciben cero requests; pero Claude/Perplexity sí lo consumen. Lo que mueve citaciones es HTML
  rastreable, autoridad y legibilidad; solo ~11% de dominios son citados por ChatGPT y Perplexity a
  la vez → optimizar por plataforma, sin bala única.
- **Alternativas descartadas**: apostar solo a `llms.txt`; bloquear crawlers de IA; contenido solo
  client-rendered (muchos crawlers de LLM no ejecutan JS de forma fiable); cloaking.
- **Gotchas**: SSG/SSR es requisito de citabilidad (bio, servicios y resultados no pueden vivir solo
  en client components). Servir `/llms.txt` estático y **excluirlo del middleware i18n**. Priorizar
  la versión EN para alcance global. No hay "Search Console para LLMs": medir por referrers y
  consultas manuales periódicas.

---

## Área 2 — Motion (GSAP)

### 2.1 GSAP + App Router (SSR)
- **Decisión**: `useGSAP()` de `@gsap/react` como único punto de entrada; cada componente que anima
  es `"use client"`; registrar plugins una vez a nivel de módulo cliente.
- **Por qué**: `useGSAP` envuelve `gsap.context()` (scope + cleanup automático), evita fugas y
  animaciones duplicadas en re-render/StrictMode.
- **Gotchas**: GSAP necesita `window` → client component obligatorio. **No ocultar contenido con
  `opacity:0` en CSS** esperando animarlo (si el JS falla o hay reduced-motion queda invisible):
  estado base visible en HTML/CSS, estado "from" solo dentro del branch animado. `contextSafe()`
  para animaciones creadas en handlers (hover).

### 2.2 Licencia y plugins
- **Decisión**: `gsap` (≥ 3.13) + `@gsap/react` desde npm público; todos los plugins gratis, uso
  comercial incluido. Importar por subpath (`gsap/ScrollTrigger`, `gsap/SplitText`), no `gsap/all`.
- **Por qué**: Webflow liberó GSAP al 100% en v3.13 (abril 2025), incluido SplitText.
- **Gotchas**: fijar `gsap >= 3.13` en `package.json` (SplitText gratuito + accesibilidad nativa).

### 2.3 ScrollTrigger (reveals)
- **Decisión**: reveals con `ScrollTrigger.batch()` animando **solo `opacity` + `translateY`**, con
  `once: true`. Pin/scrub solo donde aporte narrativa y desactivado en móvil (`matchMedia`).
  `ScrollTrigger.refresh()` tras `document.fonts.ready` y tras cambio de `pathname`.
- **Por qué**: `batch` + `once` reduce trabajo (mejor INP); reveals sobre transform/opacity no
  generan CLS.
- **Gotchas**: **`blur` es un `filter`, fuera del allowlist de la constitución** → se **omite** en el
  reveal (queda `opacity + y`); si se quisiera profundidad, usar `clip-path`/máscara. CLS externo por
  fuentes/imágenes: mitigar con dimensiones explícitas + `refresh()` tras `fonts.ready`. Pinning en
  móvil da jank → desactivar; `markers` solo en dev; `overwrite:"auto"`.

### 2.4 SplitText (titular gigante)
- **Decisión**: `SplitText` sobre un `<h1>` **semántico**, `aria:"auto"` (default), reveal por
  **líneas enmascaradas** (`mask:"lines"`, `type:"lines"`). `chars` solo puntualmente en el nombre.
- **Por qué**: v3.13 añade accesibilidad nativa (`aria-label` en el elemento, `aria-hidden` en las
  piezas → lectores leen el texto completo); `mask:"lines"` usa `overflow:hidden` + `yPercent`
  (transform puro, sin CLS ni blur).
- **Gotchas**: `aria-label` solo válido en elemento con rol que lo permita → **siempre sobre
  heading** (nunca `<div>`). Split tras `document.fonts.ready` (medir líneas). `split.revert()` en
  cleanup.

### 2.5 prefers-reduced-motion
- **Decisión**: envolver **toda** animación (incluido parallax) en `gsap.matchMedia()` con branch
  `(prefers-reduced-motion: no-preference)`; estado base del DOM ya es el final visible.
- **Gotchas**: en reduced-motion no ocultar nada (base visible → simplemente no animar). Registrar el
  listener de mouse solo dentro del branch `no-preference` + desktop (mejora INP).

### 2.6 Hero 3D con CSS
- **Decisión**: contenedor con `perspective`; formas con `transform-style: preserve-3d`; caras con
  `rotateX/Y + translateZ`. GSAP anima `rotationX/Y/Z` (continuo, `repeat:-1`) y el parallax usa
  `gsap.quickTo()`. **Sin React Three Fiber.**
- **Por qué**: CSS 3D vive en el compositor (GPU) sin coste de layout; `quickTo` reutiliza un tween
  (no crea uno por `mousemove` → clave para INP); evitar three.js ahorra cientos de KB.
- **Gotchas**: `perspective` en el padre, `preserve-3d` en el elemento con caras; pausar rotaciones
  fuera del viewport; `will-change: transform` con moderación. **El LCP debe ser el NOMBRE (texto)**,
  no las formas.

### 2.7 Rendimiento / bundle
- **Decisión**: imports por subpath (tree-shaking), solo en client components que los usan;
  `next/dynamic` (`ssr:false`) para secciones de animación below-the-fold. GSAP arranca tras
  hidratación.
- **Presupuesto**: core ~23-28KB + ScrollTrigger ~11-13KB + SplitText pocos KB + `@gsap/react` ~1KB
  ≈ **40KB gz** (holgado dentro de 150KB).
- **Regla de oro LCP**: no animar `opacity` desde 0 en el elemento LCP (el nombre); usar líneas
  enmascaradas (transform puro) o animar el entorno dejando el título estable. Medir con Lighthouse.

---

## Área 3 — Modelo de contenido y fuentes

### 3.1 Modelo de contenido
- **Decisión**: híbrido nativo — **datos estructurados** (perfil, familias, paquetes, métricas,
  cadenas UI) en módulos `.ts` tipados + **`zod`**; **casos de proyecto** (narrativa) en **MDX
  nativo** (`@next/mdx`) con front-matter validado por zod. Loader fino en `lib/content/*` (patrón
  repositorio).
- **Por qué**: Turbopack (Next 16) no ejecuta plugins webpack → content-layers heredados dan
  fricción. zod + `gray-matter` + `@next/mdx` son battle-tested; el respaldo ES + paridad exige
  lógica propia que un content-layer rígido dificulta. `z.infer` = única fuente de tipos.
- **Alternativas descartadas**: **contentlayer2** (mantenimiento, plugin webpack); **Velite**
  (plugin webpack, requiere workaround con Turbopack); **Content Collections** (la mejor "con
  baterías", pero overkill para el volumen y con caveats vivos con Next 16) → **upgrade recomendado**
  si el catálogo crece. Aislar tras `lib/content/*` para poder migrar sin tocar componentes.
- **Gotchas**: importar contenido desde Server Components hace que `schema.parse()` corra en
  `next build` (validación gratis en build). No mezclar narrativa larga en JSON ni lógica de UI en
  MDX.

### 3.2 i18n del contenido
- **Decisión**: routing con `next-intl`; almacén con **directorios por idioma**
  `content/{es,en}/…` con **paridad por slug/id compartido**. Para datos estructurados, esquema
  co-locado `{ es: T, en?: T }` (ES obligatorio, EN opcional-auditado); para MDX, un archivo por
  idioma.
- **Por qué**: directorio-por-idioma da diffs limpios y alinea con `[locale]`; ES es fuente de verdad
  (el copy nace en español); soporta el respaldo transitorio sin páginas mezcladas.
- **Gotchas**: mantener **paridad de slugs** (URLs indexables distintas; el toggle lleva a la página
  equivalente mapeando por `id`, no por título). No duplicar micro-copy (UI strings en next-intl
  **o** en `content/ui.ts`, no en ambos). El bloque de respaldo ES renderiza con marcador visible y
  `lang="es"`.

### 3.3 Validación en build
- **Decisión**: esquemas zod por entidad + script `scripts/check-content.ts` en `prebuild`/CI: (1)
  parsea cada archivo, (2) verifica paridad ES↔EN, (3) verifica paridad de slugs. **Falla** si falta
  un campo o si un ítem `published` no tiene EN; **avisa** en borradores que caen a ES.
- **Gotchas**: `alt` de capturas y `href` de CTA obligatorios en el esquema; `links.*` como
  `z.string().url()`.

### 3.4 Fuentes
- **Decisión**: **Geist + Geist Mono** vía paquete oficial `geist` (self-hosted sobre `next/font`,
  cero config). **Clash Display** (no está en Google Fonts) vía `next/font/local`: solo el/los pesos
  del hero (500/600), **`woff2` pre-subset con Latin-1** (acentos/signos ES), `display:"swap"`,
  fallback métrico. Exponer las tres como variables CSS.
- **Gotchas**: `next/font/local` preloadea **todos** los `src` → declarar solo el peso crítico con
  `preload:true` (extras en otra llamada con `preload:false`). Entregar **solo woff2** (dar `woff`
  fuerza preload). Subset debe incluir `U+00A1,U+00BF,U+00C0-00FF`. Clases `.variable` en `<html>`.

### 3.5 Tokens de diseño (paleta + tema)
- **Decisión**: tres capas — (1) **primitivos de marca** en `:root`; (2) **tokens semánticos** que
  conmutan en `:root`/`.dark`; (3) exposición a Tailwind v4 con `@theme inline`. Tema con
  `next-themes` (`attribute="class"`, `disableTransitionOnChange`) + `suppressHydrationWarning`.
- **Accesibilidad del acento (dato duro)**: `#B58863` sobre hueso ≈ **3:1** → válido para texto
  grande/objetos gráficos, **falla** 4.5:1 en texto normal. Por eso el **texto/enlace** usa
  `#8A5A34` en claro (≈5.6:1 ✓) y `#E3B98C` en oscuro (≈9.8:1 ✓); el cobre puro queda para
  rellenos, bordes y titulares grandes.
- **Alternativas descartadas**: hardcodear paleta por componente; `tailwind.config.js` (patrón v3);
  un solo tono de cobre para todo (incumple AA).
- **Gotchas**: en v4 el dark se declara en CSS (`@custom-variant dark (&:is(.dark *))`).
  `suppressHydrationWarning` en `<html>` obligatorio con next-themes. `@theme inline` (no `@theme`)
  para que las utilidades referencien las vars y respeten el runtime. `color-scheme` por tema.

---

## Área 4 — Formulario de contacto y canales

### 4.1 Envío de email
- **Decisión**: **Resend** (opcional React Email para plantillas). `from` = dominio verificado;
  `replyTo` = email del visitante. 2 correos: notificación al autor + autorespuesta al visitante.
- **Por qué**: DX serverless (fetch, sin SMTP persistente), buena entregabilidad, free tier
  3.000/mes.
- **Alternativas descartadas**: Nodemailer+SMTP (mal en serverless); SendGrid (pesado); Postmark
  (plan B).
- **Gotchas**: `from` nunca el email del visitante (rebota). Verificar dominio con **SPF/DKIM/DMARC**.
  Runtime Node si se usa React Email.

### 4.2 Server Action vs Route Handler
- **Decisión**: **Server Action** desde el `onSubmit` de react-hook-form, con la lógica real en una
  función pura compartida `lib/contact.ts`. Route Handler `POST /api/contact` **solo** si se necesita
  endpoint HTTP público.
- **Por qué**: menos boilerplate, tipado extremo a extremo, comparte el zod schema, menos superficie
  pública que un endpoint que los bots golpean.
- **Gotchas**: `headers()` es **async** en Next 15+. Lógica en función sin `"use server"` para
  reusar desde Action y Route Handler.

### 4.3 Validación
- **Decisión**: un único `contactSchema` (zod) en `lib/`, consumido por `zodResolver` (cliente) y
  `safeParse` (servidor, siempre re-valida). shadcn `Form` sobre react-hook-form.
- **Gotchas**: `zodResolver` elimina claves fuera del schema → **honeypot y `startedAt` van fuera del
  schema** (leerlos por ref y pasarlos aparte). RHF no limpia campos ante error (preserva lo escrito;
  no `reset()` salvo éxito). Errores de servidor → `form.setError(campo)`; global → `"root"`. Campo
  `tipo` (enum empleo/servicio/otro) segmenta el lead.

### 4.4 Anti-spam sin fricción
- **Decisión**: capas invisibles — **honeypot → time-trap (<3s)**. **Nota de proyecto (2026-07-11)**:
  se DESCARTA `@upstash/ratelimit` para no introducir una dependencia con estado (el usuario quiere
  cero "base de datos" y máxima simplicidad). El rate limiting, si hace falta, se hace a nivel de
  **plataforma con Vercel Firewall/BotID** (sin código ni estado en la app). **Turnstile** solo si,
  medido, sigue entrando spam.
- **Gotchas**: honeypot oculto también para AT (`sr-only`, `tabIndex=-1`, `aria-hidden`, nombre que
  el autofill no rellene como `company`). Honeypot lleno → **fingir éxito**. IP = primer valor de
  `x-forwarded-for`. Fail-open + log si Redis cae.

### 4.5 Calendly
- **Decisión**: **popup activado por botón** (carga diferida del script) + enlace directo como
  fallback; inline embed solo en una página/sección dedicada de agenda.
- **Por qué**: el widget carga iframe + script pesado; en popup no cuesta nada hasta el clic (protege
  LCP/TBT).
- **Gotchas**: nunca cargar el script en el render inicial (`next/script` `lazyOnload` o al clic).
  Accesibilidad del modal (focus trap, Esc, devolver foco). CSP: permitir `assets.calendly.com`
  (script) y `calendly.com` (frame). El CTA de Calendly apunta a PYMEs; a reclutadores,
  email/LinkedIn/formulario con igual prominencia.

### 4.6 WhatsApp / tel / mailto / LinkedIn
- **Decisión**: `https://wa.me/<dígitos>` con texto `encodeURIComponent`; `tel:` en E.164 con `+`;
  `mailto:` corto; LinkedIn a perfil. Todos con `target="_blank"` + `rel="noopener noreferrer"` y
  `aria-label` en botones de solo icono.
- **Gotchas**: WhatsApp = internacional, solo dígitos, sin `+`/espacios/`0` inicial (Colombia +57 →
  `57...`). `tel:` sí con `+`. `rel="noopener noreferrer"` obligatorio.

---

## Resumen de decisiones (tabla)

| Área | Decisión |
|---|---|
| i18n | `next-intl` v4, `app/[locale]`, pathnames localizados, SSG con `setRequestLocale` |
| SEO | Metadata API + `sitemap.ts`(alternates) + `robots.ts` + `ImageResponse` OG |
| JSON-LD | `<script ld+json>` en RSC, `@graph` con `@id`, Person/Service/CreativeWork/Breadcrumb/FAQ, `sameAs` |
| GEO | HTML SSG rastreable + AEO + consistencia de entidad primero; `llms.txt` complemento; permitir crawlers IA |
| Motion | `useGSAP` + GSAP 3.13 (npm), `ScrollTrigger.batch` (opacity+y, sin blur), `SplitText` en `<h1>`, `matchMedia` |
| Hero 3D | CSS `preserve-3d` + GSAP `rotationX/Y/Z` + `quickTo`; sin R3F; LCP = el nombre |
| Contenido | `.ts`+zod (datos) + MDX+zod (casos); nativo/Turbopack-safe; `content/{es,en}` paridad por slug |
| Build check | zod por entidad + `scripts/check-content.ts` en `prebuild` (falla en publicados sin EN) |
| Fuentes | `geist` (Sans+Mono) + `next/font/local` Clash Display (woff2 subset Latin-1, solo peso crítico) |
| Tokens/tema | 3 capas + `@theme inline`; acento cobre decorativo, texto AA por tema; `next-themes` sin flash |
| Email | Resend (`replyTo` visitante), Server Action con lógica en `lib/contact.ts` |
| Validación | zod compartido + RHF + shadcn Form; servidor re-valida |
| Anti-spam | honeypot + time-trap (sin estado); rate limit opcional vía Vercel Firewall/BotID; Turnstile solo si hace falta |
| Calendly | popup diferido por botón + enlace fallback |
| Canales | `wa.me` (dígitos), `tel:` E.164, `mailto:` corto, `rel=noopener noreferrer` |

**Todas las incógnitas del plan quedan resueltas. Sin `NEEDS CLARIFICATION` pendientes.**
