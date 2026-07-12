# UX & Design Quality Checklist: Portafolio bilingüe

**Purpose**: Gate de calidad de diseño/UX que cada vista debe superar antes de considerarse "hecha".
Deriva de [design-system.md](../design-system.md) y del skill rector anti-slop. Se aplica en la fase
`implement` y en la revisión.
**Created**: 2026-07-11

## Consistencia global (locks)

- [ ] **Theme lock**: la página no invierte por sección; única excepción deliberada = banda IA como
      bloque de color (una vez).
- [ ] **Color lock**: un único acento (cobre) en toda la página; texto/enlaces con variante AA por
      tema (`#8A5A34` claro / `#E3B98C` oscuro).
- [ ] **Shape lock**: un sistema de radios (botones pill · tarjetas 16px · inputs 10-12px).
- [ ] **Tipografía**: Clash Display (display) + Geist (cuerpo) + Geist Mono (mono); sin Inter, sin
      serif; énfasis con itálica/bold de la misma familia.
- [ ] **Un registro de copy** por página; **cero em-dash** en todo el texto visible.

## Layout y jerarquía

- [ ] Hero cabe en el viewport: titular ≤ 2 líneas, subtítulo ≤ 20 palabras, CTA sin scroll;
      `min-h-[100dvh]`, `pt` ≤ 24.
- [ ] Hero: máx. 4 elementos de texto; sin tagline/micro-strip extra.
- [ ] Nav en una sola línea desktop, altura ≤ 72px.
- [ ] ≥ 4 familias de layout distintas; ninguna familia repetida más de una vez; sin 3 cards
      idénticas; zigzag ≤ 2 seguidas.
- [ ] Eyebrows racionados: ≤ 1 por cada 3 secciones (hero incluido).
- [ ] Colapso móvil explícito por sección (`w-full`, `px-…`, grid → 1 columna < 768px).

## Motion (GSAP)

- [ ] Cada animación se justifica en una frase (jerarquía/narrativa/feedback/estado).
- [ ] Reveal = `opacity` + `translateY` (sin blur); `ScrollTrigger.batch` + `once:true`.
- [ ] Nombre del hero con `SplitText` sobre `<h1>` (`aria:"auto"`); **LCP no oculto** con opacity 0.
- [ ] Formas 3D en CSS + `quickTo` para parallax; pausan fuera de viewport; sin R3F.
- [ ] `pin/scrub` como máximo en una sección; marquee máximo uno.
- [ ] Todo envuelto en `gsap.matchMedia()`; `prefers-reduced-motion` → estático; sin
      `window.addEventListener('scroll')`.

## Estados e interacción

- [ ] Hover/focus/active diseñados; `:active` con feedback físico.
- [ ] Focus visible (anillo AA) en ambos temas; nunca `outline:none` sin reemplazo.
- [ ] Estados loading (skeleton), empty ("próximamente"), error (inline + `role="alert"` con canal
      alternativo).
- [ ] Contraste AA de todo CTA, input, placeholder, focus ring y helper en su fondo (ambos temas).

## Assets

- [ ] Iconos de una sola familia (Phosphor); sin SVG de icono a mano.
- [ ] Imágenes con dimensiones explícitas y `alt`; placeholders `picsum` con seed hasta tener
      reales; **sin fake screenshots con `<div>`**.
- [ ] `next/image` con `priority` solo en el LCP; resto diferido.

## Conversión

- [ ] Bifurcación dual clara en la home (contratar / negocios).
- [ ] Una etiqueta por intención de CTA ("Hablemos" contratación · "Agenda tu diagnóstico gratis"
      PYME); sin CTAs duplicados de la misma intención.
- [ ] Cada paquete de servicio: problema → qué recibes → resultado → CTA.

## Rendimiento (CWV)

- [ ] LCP < 2.5s (el nombre pinta de inmediato), INP < 200ms, CLS < 0.1.
- [ ] JS de home < 150 KB gz; GSAP y terceros (Calendly) diferidos.
- [ ] Solo se anima `transform`/`opacity`/`clip-path`.

## Notas

- Este gate se ejecuta por vista en `implement` y en la revisión de código (agente code-reviewer +
  a11y). Un fallo en cualquier casilla bloquea el "hecho" de esa vista.
