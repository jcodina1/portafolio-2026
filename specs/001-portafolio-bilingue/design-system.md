# Design System & UX: Portafolio bilingüe

**Feature**: `001-portafolio-bilingue` · **Fecha**: 2026-07-11

Sistema de diseño y guía de UX que gobierna la implementación. Destila los skills de frontend
relevantes (design-taste-frontend como rector; gpt-taste para motion/AIDA; high-end-visual-design
para el "feel caro"; emil-design-eng para pulido de interacción; minimalist-ui para restraint
editorial) y los aterriza en la dirección de marca del proyecto. Complementa la
[constitución](../../.specify/memory/constitution.md) v1.1.0 y el [plan](./plan.md). Regla de copy
del sitio: **cero em-dash** (guiones normales, comas, dos puntos, paréntesis).

## 0. Design Read y diales

**Design Read**: portafolio de desarrollador + landing de servicios para audiencia dual
(reclutadores/CTOs que contratan y dueños de PYME que compran), con lenguaje "instrumento de
precisión + confianza editorial" en clave futurista, sobre Next.js 16 + Tailwind v4 + shadcn/ui +
GSAP, tema claro y oscuro.

**Diales** (globales; anulan el preset por decisión de marca):
- `DESIGN_VARIANCE: 7` — asimetría intencional y editorial; nunca caos. Precisión, no ruido.
- `MOTION_INTENSITY: 7` — coreografía GSAP con propósito; se mueve de verdad, sin distraer.
- `VISUAL_DENSITY: 3` — editorial y aireado; secciones con mucho aire (galería, no cabina).

**Sistema de diseño**: es una **estética**, no un sistema de terceros. Base: Tailwind v4 + shadcn/ui
(componentes propios, nunca en estado por defecto) + CSS nativo para lo editorial/glass/3D.
Honestidad: el glass es una **aproximación** con `backdrop-filter` + borde interior + fallback de
`prefers-reduced-transparency` (no es "Apple Liquid Glass" oficial).

**Desviación declarada del skill rector**: su default de animación es Motion (framer-motion); aquí
usamos **GSAP** como única librería (constitución IV). Aplican sus reglas de motion (motivado,
reduced-motion, solo transform/opacity, esqueletos §5.A/§5.B) pero el gate de reduced-motion se hace
con `gsap.matchMedia()`, no con `useReducedMotion` de Motion.

## 1. Tipografía

Tres familias, con intención por rol (nada de Inter, nada de serif):

| Rol | Fuente | Especificación |
|-----|--------|----------------|
| Titulares/display | **Clash Display** | pesos 500/600; `tracking-tight`, `leading-[1.05]` |
| Cuerpo | **Geist** | `text-base`/`lg`, `leading-relaxed`, medida `max-w-[68ch]` |
| Etiquetas, métricas, código | **Geist Mono** | mayúsculas con `tracking` para eyebrows; tabular para cifras |

**Escala fluida (clamp)**:
- Nombre del hero (`<h1>`): `clamp(2.75rem, 1rem + 11vw, 9.5rem)`, mayúsculas, `leading-[0.95]`.
- H2 de sección: `clamp(1.9rem, 1rem + 3.2vw, 3.75rem)`.
- H3 / títulos de tarjeta: `clamp(1.25rem, 1rem + 1vw, 1.75rem)`.
- Cuerpo: `clamp(1rem, 0.95rem + 0.3vw, 1.15rem)`.

**Reglas**:
- Énfasis dentro de un titular = **itálica o bold de la MISMA familia**, nunca inyectar otra fuente.
- Clearance de descendentes en itálicas display (`y g j p q`): `leading-[1.1]` mínimo + `pb-1`.
- La jerarquía se controla con escala + peso + color, no solo con tamaño bruto.

## 2. Color y tema

**Paleta con acento ÚNICO (cobre). Lock: un solo acento en TODA la página.**

Modelo de **tres capas** (Tailwind v4 + shadcn, tokens en CSS):
1. Primitivos de marca (fijos): Marino `#14293B`, Cobre `#B58863`, Grafito `#3A3A38`,
   Piedra `#B9B6AC`, Hueso `#FAF9F6`, Negro `#0E151C`.
2. Semánticos que conmutan en `:root`/`.dark` (`--background`, `--foreground`, `--accent`,
   `--link`, `--border`, `--surface`).
3. Exposición a Tailwind con `@theme inline` (utilidades `bg-background`, `text-accent`, ...).

**Accesibilidad del cobre (dato duro)**: `#B58863` sobre hueso da ~3:1 → válido solo para texto
grande y objetos gráficos, **falla** para texto normal. Por tanto:
- Cobre puro `#B58863`: rellenos, bordes, glows, cantos de las formas 3D, titulares grandes.
- **Texto/enlaces**: variante AA por tema, `#8A5A34` en claro (~5.6:1) y `#E3B98C` en oscuro (~9.8:1).

**Tema**: claro (fondo hueso, glow cálido) y oscuro (fondo marino-negro, glow cobre) con
`next-themes` (`attribute="class"`, `disableTransitionOnChange`, `suppressHydrationWarning`, sin
FOUC). **Theme lock**: la página no invierte por sección. Única excepción deliberada: la banda
"cómo trabajo con IA" es un **bloque de color** marino-negro dentro del tema claro (permitido una
vez); en tema oscuro se diferencia por tono, no por inversión.

**Prohibido**: gradientes morados/neón, glows neón, negro puro `#000`, blanco puro `#fff`, más de un
acento.

## 3. Espaciado, ritmo y layout

- **Densidad editorial (dial 3)**: secciones amplias, `py-24 md:py-32 lg:py-40`; el aire es parte
  del "feel caro".
- Contenedor: `max-w-[1400px] mx-auto px-6 md:px-8`; texto de lectura `max-w-[68ch]`.
- **Grid sobre flex-math**: `grid grid-cols-…`, nunca `w-[calc(33%-…)]`.
- **Estabilidad de viewport**: hero con `min-h-[100dvh]`, nunca `h-screen`.
- **Familias de layout (mínimo 4 distintas; una familia se repite como máximo una vez)**:
  1. **Hero kinetic-type**: nombre gigante centrado + capa de formas 3D detrás (el nombre ES el
     diseño; centrado permitido para hero-manifiesto).
  2. **Bifurcación dual (split 50/50)**: dos paneles diferenciados "para equipos que contratan" /
     "para negocios". No son 3 tarjetas iguales.
  3. **Banda de métricas**: cifras tabulares (Geist Mono) con contadores animados, sin cajas de
     tarjeta; los números respiran en layout plano.
  4. **Banda IA (bloque de color)**: full-width marino-negro con glow cobre, 3 pasos nombrados por
     su acción (no "Fase 1/2/3").
  5. **Proyectos**: tarjetas documentales glass con slot de imagen real, mismo peso visual, rejilla
     con ritmo (no zigzag ×3, no 3 cards idénticas).
  6. **Servicios**: familias como secciones; cada paquete con gancho → qué recibes → resultado → CTA.
  7. **Contacto**: formulario editorial + canales.
- **Nav**: una sola línea en desktop, altura ≤ 72px, glass sticky. Sin numeración.
- Cap de zigzag: máximo 2 secciones seguidas con patrón imagen+texto.

## 4. Materialidad, forma y profundidad

- **Sistema de radios único y documentado**: interactivos (botones) = **pill** (`rounded-full`);
  superficies/tarjetas = **16px** (`rounded-2xl`); inputs = **10-12px**. Sin mezclar fuera de esta
  regla.
- **Glass (aproximación honesta)**: `backdrop-blur` + borde interior 1px (`border-white/10` en
  oscuro, hairline piedra en claro) + highlight interior (`inset 0 1px 0 …`) + **sombra tintada al
  fondo** (marino, nunca negra dura). Fallback sólido bajo `prefers-reduced-transparency`.
- **Sombras**: siempre tintadas al tono del fondo; nada de `drop-shadow` negro sobre claro.
- **Tarjetas solo cuando la elevación comunica jerarquía real**; si no, agrupar con `border-t`,
  `divide-y` o espacio negativo.
- **Botones**: pill con icono en su propio círculo; `:active` `scale-[0.98]` o `-translate-y-[1px]`
  (feedback físico); CTA principal con micro-física magnética (solo desktop + `no-preference`).

## 5. Motion (GSAP)

`MOTION_INTENSITY 7`: la página se mueve de verdad, con propósito. **Cada animación se justifica en
una frase** (jerarquía / narrativa / feedback / cambio de estado); si no, se elimina.

- **Librería**: GSAP 3.13 + `@gsap/react` (`useGSAP`), plugins por subpath. Única librería de motion.
- **Reveal estándar**: `opacity 0→1` + `translateY 24→0`, `stagger 0.06-0.08`, ease
  `cubic-bezier(0.16,1,0.3,1)` / `power4.out`, `ScrollTrigger.batch` con `once:true`. **Sin `blur`**
  (es `filter`, fuera del allowlist de la constitución).
- **Nombre del hero**: `SplitText` sobre el `<h1>` semántico, `aria:"auto"`, `mask:"lines"`,
  `yPercent 110→0`; disparar tras `document.fonts.ready`. **El nombre es el LCP: no ocultarlo con
  `opacity:0`** (usar líneas enmascaradas = transform puro).
- **Formas 3D del hero**: CSS `preserve-3d` + GSAP `rotationX/Y/Z` continuo (`repeat:-1`) + parallax
  de mouse con `gsap.quickTo()`; pausar fuera de viewport. Sin React Three Fiber.
- **Contadores**: métricas cuentan al entrar en viewport.
- **Scroll narrativo (pin/scrub)**: reservado para como máximo UNA sección con narrativa real (p.
  ej. la banda IA), con los esqueletos canónicos (`start:"top top"`, `pin:true`, `scrub`). Marquee:
  máximo uno en toda la página (si acaso).
- **Reduced-motion**: todo (incluido parallax y rotación) envuelto en `gsap.matchMedia()`; estado
  base ya visible → en `reduce` simplemente no se anima. Listener de mouse solo en `no-preference` +
  desktop.
- **Prohibido**: `window.addEventListener('scroll')`, cálculo de scroll en estado de React,
  animar layout (`width/height/top/left`), mezclar otra librería de animación.

## 6. Estados de interacción (ciclos completos)

- **Hover/Focus/Active**: diseñados, no por defecto. `:active` con feedback físico. Transiciones
  `cubic-bezier(0.16,1,0.3,1)`, duración 150-300ms.
- **Focus visible (a11y)**: anillo con la variante AA del cobre, `outline-offset: 2px`, visible en
  ambos temas; nunca `outline:none` sin reemplazo.
- **Loading**: skeletons con la forma del contenido final (no spinners genéricos).
- **Empty**: composición cuidada que indica cómo poblar (p. ej. proyectos "próximamente").
- **Error**: inline por campo en formularios; `role="alert"` para el error global, con canal
  alternativo (WhatsApp/email) visible.
- **Contraste de botones y formularios**: todo CTA, input, placeholder, focus ring y helper text
  pasa AA en su fondo. Nada de texto claro sobre casi-blanco.

## 7. Estructura de conversión (AIDA, doble ruta)

- **Attention**: hero (nombre + propuesta en ≤ 20 palabras de subtítulo).
- **Interest**: bifurcación dual + métricas + banda IA.
- **Desire**: proyectos (prueba) + servicios (problema → beneficio → resultado).
- **Action**: gancho "diagnóstico gratis" (PYME) y "Hablemos" (general/reclutador).
- **Lock de intención de CTA (una etiqueta por intención)**:
  - Contratación/general → **"Hablemos"** (mismo texto en hero, nav y footer).
  - PYME/venta → **"Agenda tu diagnóstico gratis"** (→ Calendly).
  - Navegación de prueba → "Ver proyectos", "Ver soluciones", "Ver mi perfil".
  Se documentan como intenciones DISTINTAS (contratar vs. comprar), no CTAs duplicados.
- **Hero stack** (máx. 4 elementos): eyebrow mono ("SENIOR FULLSTACK · LÍDER · BOGOTÁ"), nombre,
  subtítulo, CTAs (1 primario + 1 secundario). Sin tagline extra ni micro-strip de confianza dentro
  del hero.

## 8. Iconos, imágenes y assets

- **Iconos**: familia única **Phosphor** (`@phosphor-icons/react`), `weight`/`strokeWidth`
  consistente. Reemplazar el `lucide-react` que trae shadcn por Phosphor (una sola familia). Nunca
  dibujar SVG de icono a mano.
- **Imágenes de proyecto**: reales cuando existan; hasta entonces `https://picsum.photos/seed/
  {slug-descriptivo}/{w}/{h}` con dimensiones explícitas y `alt`. Prohibido: "screenshots" falsos
  hechos con `<div>`.
- **Formas 3D del hero**: geométricas, generadas por código (CSS 3D). Es dirección de arte, no un
  fake screenshot ni ilustración SVG a mano (permitido).
- **`next/image`** siempre, con `priority` solo en el LCP; resto diferido; AVIF/WebP.

## 9. Accesibilidad (WCAG 2.2 AA, no negociable)

- Contraste AA en **ambos** temas (texto usa variantes AA del cobre).
- Operable 100% por teclado (nav, selector de idioma, toggle de tema, formulario, CTAs) con foco
  visible.
- `SplitText` sobre heading semántico con `aria:"auto"` (lectores leen el texto completo).
- `prefers-reduced-motion`: animaciones y parallax colapsan a estático.
- Honeypot oculto también para lectores (`sr-only`, `aria-hidden`, `tabIndex=-1`).
- Modal de Calendly: focus trap, cierre con `Esc`, devolver foco al disparador.
- Formularios: label sobre input, error debajo, sin placeholder-as-label.

## 10. AI-tells prohibidos (específicos de este proyecto)

Además del **cero em-dash** (constitución): sin scroll cues ("scroll", flecha animada); sin version
labels en el hero (V0.6/BETA); sin eyebrows de numeración de sección ("01 / Servicios"); **eyebrows
racionados a ≤ 1 por cada 3 secciones** (el hero cuenta como 1); sin puntos de estado decorativos;
sin strips de locale/tiempo/clima; sin `border-t`+`border-b` en cada fila de listas largas; sin 3
tarjetas iguales; sin nombres/números falsos "perfectos"; sin verbos de relleno ("Elevate",
"Seamless", "Next-Gen"); un solo registro de copy por página.

## 11. Pre-flight de diseño (gate antes de considerar una vista "hecha")

Ver checklist accionable en [checklists/ux-design.md](./checklists/ux-design.md). Resumen: theme
lock, color/shape lock, contraste AA de CTAs y formularios en ambos temas, hero cabe en viewport
(≤ 2 líneas de titular, subtítulo ≤ 20 palabras), nav en una línea, ≥ 4 familias de layout, eyebrows
racionados, cero em-dash, motion motivado + reducido, imágenes reales (sin fakes con div), CWV
plausibles (LCP = nombre no oculto), iconos de una sola familia.
