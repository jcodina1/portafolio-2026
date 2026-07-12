# Quickstart: validación del Portafolio bilingüe

**Feature**: `001-portafolio-bilingue` · **Fase 1**

Guía para poner en marcha el proyecto y **validar de punta a punta** que cada historia de usuario y
criterio de éxito se cumple. No contiene implementación; referencia
[data-model.md](./data-model.md) y [contracts/](./contracts/). Los pasos concretos de construcción
saldrán en `tasks.md` (`/speckit-tasks`).

## Prerrequisitos

- Node 20+ y pnpm (o npm).
- Cuentas/servicios: Resend (dominio verificado), Upstash Redis, Calendly. Todas vía variables de
  entorno (ver [contracts/contact.md](./contracts/contact.md)); ninguna clave en el código.

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local     # rellenar RESEND_*, UPSTASH_*, NEXT_PUBLIC_* (Calendly/WhatsApp/…)
pnpm dev                       # desarrollo en http://localhost:3000/es
```

Comandos de verificación:

```bash
pnpm check:content   # tsx scripts/check-content.ts — valida contenido + paridad ES/EN (corre en prebuild)
pnpm typecheck       # tsc --noEmit (TS strict)
pnpm build           # next build (SSG); falla si el contenido no valida
pnpm test            # vitest (unit: esquemas, lib/contact)
pnpm test:e2e        # playwright (E2E + visual + axe a11y)
pnpm lhci            # Lighthouse CI (Core Web Vitals)
```

## Escenarios de validación (mapa a Success Criteria)

### US1 — PYME agenda/solicita (P1)
1. Abrir `/es/servicios/automatizacion-ia`: cada paquete muestra gancho → qué recibes → resultado →
   CTA. **(FR-010/011)**
2. Pulsar "Agenda tu diagnóstico gratis": abre el popup de Calendly (cargado solo al clic). **(FR-012)**
3. Enviar el formulario de `/es/contacto` con datos válidos → confirmación visible y email recibido
   con `replyTo`. **(SC-003, FR-014/016)**
4. Enviar con datos inválidos → errores por campo, sin perder lo escrito. **(FR-015)**
5. Desde la home a iniciar contacto en ≤ 3 clics. **(SC-001)**

### US2 — Reclutador evalúa (P1)
1. En la home, la bifurcación "para equipos que contratan" lleva al perfil. **(FR-003)**
2. `/es/perfil` muestra rol, stack, experiencia/liderazgo, métricas y enlaces; CTA de contacto. Home
   → perfil → contacto en ≤ 2 clics. **(SC-002, FR-006)**

### US3 — Proyectos (P2)
1. `/es/proyectos` lista los 3 casos; los `coming-soon` se distinguen. **(FR-007/009)**
2. Abrir un caso: rol, stack, problema→solución→resultado, capturas con `alt`, enlaces si existen.
   **(FR-008)**

### US4 — Bilingüe (P2)
1. Cambiar ES↔EN en varias páginas: todo el contenido visible se traduce, la URL refleja el idioma y
   se mantiene la página equivalente. **(SC-004, FR-019/020)**
2. `pnpm check:content` pasa (paridad de publicados). **(FR-021)**

### US5 — SEO/GEO (P2)
1. Ver el fuente de cada tipo de página: `<title>`/`description`, OG/Twitter, canónica propia por
   locale, `hreflang` (+ `x-default`), y JSON-LD (`Person`/`Service`/`CreativeWork`/`Breadcrumb`).
   **(SC-007, FR-022/023)**
2. `/(sitemap.xml)`, `/robots.txt` y `/llms.txt` responden 200 y no son redirigidos por el
   middleware. `robots` no bloquea crawlers de IA. **(FR-023)**
3. Cada familia de servicio y cada proyecto tienen URL propia indexable. **(SC-008)**
4. `sameAs` del `Person` coincide con LinkedIn/GitHub reales. **(FR-024)**

### US6 — Tema claro/oscuro (P3)
1. Alternar tema: sin parpadeo inicial; la preferencia persiste. **(FR-027)**
2. Contraste AA en ambos temas (texto usa variantes de cobre `#8A5A34`/`#E3B98C`). **(SC-006)**

### Accesibilidad y rendimiento (transversal)
1. `pnpm test:e2e` (axe) sin errores AA en todas las páginas y ambos temas. **(SC-006)**
2. Operar todo solo con teclado: nav, selector de idioma, toggle de tema, formulario, CTAs; foco
   visible. **(SC-009)**
3. Con `prefers-reduced-motion` activo: animaciones y parallax colapsan a estático; contenido usable.
4. `pnpm lhci`: LCP < 2.5s, INP < 200ms, CLS < 0.1; JS de home < 150 KB gz. LCP = el nombre (no
   oculto por animación). **(SC-005)**

### Contenido como datos (transversal)
1. Añadir un proyecto/paquete editando `content/**` → aparece sin tocar componentes; publicar sin EN
   rompe el build con error legible. **(SC-010, FR-029/030)**

## Definición de "validado"

Todos los escenarios anteriores pasan, `pnpm build` es verde, `check:content`/`typecheck`/`test`/
`test:e2e`/`lhci` pasan, y el Constitution Check del [plan](./plan.md) sigue en verde tras la
implementación.
