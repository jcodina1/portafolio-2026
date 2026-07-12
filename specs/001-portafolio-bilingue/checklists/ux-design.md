# UX & Design Quality Checklist: Portafolio bilingüe

**Purpose**: Gate de calidad de diseño/UX que cada vista debe superar antes de considerarse "hecha".
Deriva de [design-system.md](../design-system.md) y del skill rector anti-slop. Se aplica en la fase
`implement` y en la revisión.
**Created**: 2026-07-11

## Consistencia global (locks)

- [x] **Theme lock**: la página no invierte por sección; única excepción deliberada = banda IA como
      bloque de color (una vez).
- [x] **Color lock**: un único acento (cobre) en toda la página; texto/enlaces con variante AA por
      tema (`#8A5A34` claro / `#E3B98C` oscuro).
- [x] **Shape lock**: un sistema de radios (botones pill · tarjetas 16px · inputs 10-12px).
- [x] **Tipografía**: Clash Display (display) + Geist (cuerpo) + Geist Mono (mono); sin Inter, sin
      serif; énfasis con itálica/bold de la misma familia.
- [x] **Un registro de copy** por página; **cero em-dash** en todo el texto visible.

## Layout y jerarquía

- [x] Hero cabe en el viewport: titular ≤ 2 líneas, subtítulo ≤ 20 palabras, CTA sin scroll;
      `min-h-[100dvh]`, `pt` ≤ 24.
- [x] Hero: máx. 4 elementos de texto; sin tagline/micro-strip extra.
- [x] Nav en una sola línea desktop, altura ≤ 72px.
- [x] ≥ 4 familias de layout distintas; ninguna familia repetida más de una vez; sin 3 cards
      idénticas; zigzag ≤ 2 seguidas.
- [x] Eyebrows racionados: ≤ 1 por cada 3 secciones (hero incluido).
- [x] Colapso móvil explícito por sección (`w-full`, `px-…`, grid → 1 columna < 768px).

## Motion (GSAP)

- [x] Cada animación se justifica en una frase (jerarquía/narrativa/feedback/estado).
- [x] Reveal = `opacity` + `translateY` (sin blur); `ScrollTrigger.batch` + `once:true`.
- [x] Nombre del hero con `SplitText` sobre `<h1>` (`aria:"auto"`); **LCP no oculto** con opacity 0.
- [x] Formas 3D en CSS + `quickTo` para parallax; pausan fuera de viewport; sin R3F.
- [x] `pin/scrub` como máximo en una sección; marquee máximo uno.
- [x] Todo envuelto en `gsap.matchMedia()`; `prefers-reduced-motion` → estático; sin
      `window.addEventListener('scroll')`.

## Estados e interacción

- [x] Hover/focus/active diseñados; `:active` con feedback físico.
- [x] Focus visible (anillo AA) en ambos temas; nunca `outline:none` sin reemplazo.
- [x] Estados loading (skeleton), empty ("próximamente"), error (inline + `role="alert"` con canal
      alternativo).
- [x] Contraste AA de todo CTA, input, placeholder, focus ring y helper en su fondo (ambos temas).

## Assets

- [x] Iconos de una sola familia (Phosphor); sin SVG de icono a mano.
- [x] Imágenes con dimensiones explícitas y `alt`; placeholders `picsum` con seed hasta tener
      reales; **sin fake screenshots con `<div>`**.
- [x] `next/image` con `priority` solo en el LCP; resto diferido.

## Conversión

- [x] Bifurcación dual clara en la home (contratar / negocios).
- [x] Una etiqueta por intención de CTA ("Hablemos" contratación · "Agenda tu diagnóstico gratis"
      PYME); sin CTAs duplicados de la misma intención.
- [x] Cada paquete de servicio: problema → qué recibes → resultado → CTA.

## Rendimiento y carga (CWV)

- [x] LCP < 2.5s (el nombre pinta de inmediato), INP < 200ms, CLS < 0.1.
- [x] JS de home < 150 KB gz; GSAP y terceros (Calendly) diferidos.
- [x] Solo se anima `transform`/`opacity`/`clip-path`.
- [x] Toda operación async (envío, Calendly, transición de ruta, contenido diferido) muestra
      loading/skeleton en < 100 ms; nunca UI en blanco o congelada; `loading.tsx` por segmento.

## Seguridad

- [x] CSP + cabeceras de seguridad presentes; CSP permite solo los orígenes de Calendly.
- [x] Cero secretos en el bundle cliente (solo `NEXT_PUBLIC_*` no sensibles).
- [x] Enlaces externos con `rel="noopener noreferrer"`; anti-spam sin estado (honeypot + time-trap).

## Notas

- Este gate se ejecuta por vista en `implement` y en la revisión de código (agente code-reviewer +
  a11y). Un fallo en cualquier casilla bloquea el "hecho" de esa vista.
