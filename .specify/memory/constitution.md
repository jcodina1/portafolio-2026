<!--
SYNC IMPACT REPORT
Version change: 1.1.0 → 1.2.0
Bump rationale: MINOR — añade Seguridad web (CSP + cabeceras) a Restricciones Técnicas y estados de
carga obligatorios en el Principio IV. (1.1.0 añadió GEO/LLM en I, doble ruta de conversión en II,
motion GSAP en IV, tipografía/tema/anti-plantilla en VI, y arquitectura híbrida + tokens.) Sin
eliminaciones ni redefiniciones incompatibles.
Modified principles:
  I. Visibilidad y SEO primero → + GEO/AEO (descubribilidad por LLMs)
  II. Orientación a conversión → doble ruta (contratar / comprar servicios) + gancho diagnóstico
  IV. Rendimiento → + sistema de motion (GSAP único, CSS 3D sobre R3F)
  VI. Calidad de código y diseño intencional → + tipografía, tema claro/oscuro, reglas anti-"tells"
Added sections: (dentro de Restricciones Técnicas) Arquitectura, Tema, Tipografía, Motion,
  Contacto, Paleta y tokens
Removed sections: None
Templates status:
  ✅ .specify/templates/plan-template.md (Constitution Check lee este archivo dinámicamente)
  ✅ .specify/templates/spec-template.md (sin cambios requeridos)
  ✅ .specify/templates/tasks-template.md (categorías genéricas cubren los tipos de tarea)
Deferred TODOs: None
-->

# Portafolio Constitution

Portafolio personal bilingüe (ES/EN) de Juan Camilo Codina Ariza, desarrollador de software.
Doble propósito e igual prioridad: (1) mostrar el perfil profesional y captar oportunidades de
empleo senior/lead (reclutadores/CTOs), y (2) vender servicios de desarrollo (plataformas,
automatización e IA, sitios de alta conversión) a PYMEs/SAS. La IA es un hilo transversal:
servicio ofertado, prueba en proyectos, contenido de autoridad y forma de trabajar.
Stack: Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui, desplegado en Vercel.

## Core Principles

### I. Visibilidad, SEO y GEO primero
El sitio DEBE ser encontrable y compartible tanto por buscadores como por LLMs. Cada página
pública DEBE definir metadatos completos (`title`, `description`), Open Graph/Twitter Card, y
datos estructurados JSON-LD apropiados (`Person` para el perfil, `Service`/`Offer` para
servicios, `BreadcrumbList`, y `FAQPage` donde aplique). El proyecto DEBE generar `sitemap.xml`,
`robots.txt` y `llms.txt`, y mantener URLs canónicas estables con `hreflang` por idioma.
Para descubribilidad por LLMs (GEO/AEO): la identidad del autor DEBE ser consistente en la web
(mismo nombre, título, bio y enlaces `sameAs` que LinkedIn/GitHub), y el contenido clave DEBE
estar redactado de forma clara y orientada a respuestas. Ninguna página puede publicarse sin sus
metadatos.
Rationale: la visibilidad en buscadores y la citación por LLMs son objetivos primarios; un
one-pager sin superficie indexable no los cumple (ver Arquitectura híbrida).

### II. Orientación a conversión (doble ruta)
La home DEBE bifurcar con claridad hacia las dos audiencias: "para equipos que contratan" (ruta
de empleo → perfil/CV/contacto) y "para negocios que necesitan una solución" (ruta comercial →
servicios/diagnóstico). Toda página comercial DEBE guiar hacia un CTA claro y dominante por vista.
Los servicios se tratan como landing de ventas (problema → beneficio → resultado → CTA), con el
gancho de entrada "diagnóstico gratuito" siempre accesible. El contacto DEBE ser multicanal
(formulario, agenda/Calendly, WhatsApp, email, LinkedIn) y toda vía DEBE confirmar el envío y
manejar errores de forma explícita, sin perder lo escrito por el usuario.
Rationale: ambas audiencias son igual de prioritarias; cada una necesita su ruta y su CTA.

### III. Accesibilidad WCAG 2.2 AA (NO NEGOCIABLE)
Todo componente y página DEBE cumplir WCAG 2.2 nivel AA: HTML semántico, navegación completa por
teclado con foco visible, contraste de color suficiente en AMBOS temas (claro y oscuro), textos
alternativos en imágenes con contenido, y respeto a `prefers-reduced-motion` (las animaciones no
esenciales se desactivan y colapsan a estático). Los elementos interactivos DEBEN tener nombres
accesibles. Este principio no se pospone ni se negocia por plazos.
Rationale: amplía la audiencia, es requisito legal en muchos mercados y es señal directa de la
calidad profesional que el autor vende.

### IV. Rendimiento y motion (Performance Budgets)
El sitio DEBE cumplir Core Web Vitals en producción: LCP < 2.5s, INP < 200ms, CLS < 0.1. Las
animaciones DEBEN usar solo propiedades compositor-friendly (`transform`, `opacity`, `clip-path`);
está prohibido animar propiedades que fuerzan layout (`width`, `height`, `top`, `left`, `margin`).
El sistema de motion es **GSAP + ScrollTrigger** (y SplitText para el titular) como ÚNICA
biblioteca de animación; no se mezcla con otra. Las formas 3D del hero se hacen con **CSS 3D
transforms**, NO con React Three Fiber (evitar el peso de three.js). GSAP se inicializa en cliente
con guarda de hidratación (`useGSAP`/`gsap.context`). Las imágenes DEBEN servirse en AVIF/WebP con
dimensiones explícitas y `next/image`, priorizando solo el hero y difiriendo el resto. Las
bibliotecas pesadas se importan de forma dinámica. Presupuesto de JS de la home objetivo
< 150 KB gzip (excluyendo lo diferido). Toda operación asíncrona o contenido diferido (envío del
formulario, apertura de la agenda, transición de ruta, sección o imagen que carga) DEBE mostrar un
estado de carga (skeleton o indicador); nunca UI en blanco o congelada. Las rutas exponen UI de
carga a nivel de segmento.
Rationale: el rendimiento afecta al SEO (I), a la conversión (II) y a la percepción de competencia
técnica; el motion premium no puede costar los CWV, y una espera sin feedback se percibe como lentitud.

### V. Internacionalización real ES/EN
El sitio es bilingüe español/inglés desde v1. NINGÚN texto visible puede estar hardcodeado: todo
el copy DEBE provenir de recursos de traducción por idioma. Las rutas DEBEN estar localizadas y
cada página DEBE exponer `hreflang` y una URL canónica por idioma. Ambos idiomas DEBEN mantener
paridad de contenido; una cadena sin traducir es un defecto. El contenido nace en español y su
traducción al inglés la aporta/aprueba el autor.
Rationale: el objetivo de visibilidad exige alcance internacional sin sacrificar cercanía a las
PYMEs hispanohablantes.

### VI. Calidad de código y diseño intencional
TypeScript en modo estricto (sin `any` implícito). Los archivos se mantienen < 800 líneas y las
funciones < 50; la anidación no supera 4 niveles (retornos tempranos). Se prefieren patrones
inmutables. Los tokens de diseño (color, tipografía, espaciado, radios, duración) viven como
custom properties CSS / config de Tailwind; NADA de valores de diseño repetidos y hardcodeados.
La tipografía es Clash Display (titulares), Geist (cuerpo) y Geist Mono (etiquetas/métricas); no
se usa Inter ni serif. El sitio ofrece tema claro y oscuro (persistente, sin flash/FOUC). La UI
DEBE ser intencional y NO parecer plantilla, respetando reglas anti-"tells": un único color de
acento (cobre) y un único sistema de radios; sin em-dash (—) en el copy; sin gradientes
morados/neón; sin tarjetas idénticas repetidas; sin cursor custom ni "scroll to explore"; máximo
un eyebrow (etiqueta mono en mayúsculas) cada tres secciones.
Rationale: el propio sitio es la mejor demostración de la habilidad que el autor vende.

### VII. Contenido gestionable como datos
La información personal, los proyectos y los servicios DEBEN vivir en datos estructurados o MDX
editables (una fuente de verdad por idioma), separados de la lógica de presentación. Añadir un
proyecto, un servicio o actualizar la bio NO DEBE requerir modificar componentes de React.
Rationale: permite iterar contenido con rapidez, reduce regresiones y sostiene el Principio VI.

## Restricciones Técnicas

- **Stack fijo**: Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui.
- **Hosting**: Vercel (funciones serverless para el formulario, imágenes optimizadas, edge).
- **Arquitectura híbrida**: la home es un one-pager premium; además existen páginas dedicadas e
  indexables por idioma para servicios (`/servicios/[familia]`), proyectos (`/proyectos/[slug]`) y
  perfil (`/perfil`). El blog queda como fase 2 pero la arquitectura DEBE admitirlo sin refactor.
- **Tema**: claro (fondo hueso) y oscuro (marino-negro) con `next-themes`, persistente y sin FOUC.
- **Tipografía**: Clash Display + Geist + Geist Mono (self-host/subset donde sea posible).
- **Motion**: GSAP + ScrollTrigger (+ SplitText); sin otra librería de animación; hero 3D con CSS.
- **Contacto**: formulario (validación cliente + servidor, anti-abuso **sin estado** con honeypot +
  time-trap, y servicio de email transaccional) + agenda/Calendly + WhatsApp + email + LinkedIn. Sin
  base de datos ni Redis; firewall/BotID de Vercel como refuerzo opcional de plataforma.
- **Seguridad web**: CSP en producción que permite solo los orígenes de terceros usados (Calendly) +
  cabeceras (HSTS, `X-Content-Type-Options: nosniff`, control de framing, `Referrer-Policy`,
  `Permissions-Policy`). Secretos solo en variables de entorno del servidor; nada sensible en el
  bundle cliente. Enlaces externos con `rel="noopener noreferrer"`; dependencias actualizadas.
- **Paleta y tokens** (acento único cobre): Marino `#14293B`, Cobre `#B58863` (AA: `#8A5A34`
  sobre claro / `#E3B98C` sobre oscuro), Grafito `#3A3A38`, Piedra `#B9B6AC`, Hueso `#FAF9F6`,
  Negro `#0E151C`.
- **Secretos**: ninguna clave/API/token hardcodeada; variables de entorno; sin `.env` real en el repo.
- **Organización de archivos**: por dominio/feature, muchos archivos pequeños y cohesivos.

## Flujo de Trabajo y Puertas de Calidad

- El desarrollo sigue el flujo de Spec Kit: constitution → specify → (clarify) → plan → tasks →
  (analyze) → implement.
- Antes de considerar una feature completa DEBE verificarse: build de producción sin errores,
  TypeScript sin errores, metadatos/SEO+GEO presentes, comprobación de accesibilidad (teclado +
  contraste en ambos temas + reduced-motion), y paridad de idiomas ES/EN.
- Todo cambio de código se revisa contra esta constitución; las violaciones de principios NO
  NEGOCIABLES (III) bloquean la publicación.

## Governance

Esta constitución prevalece sobre cualquier otra práctica del proyecto. Las enmiendas requieren:
(a) documentar el cambio y su motivación, (b) actualizar la versión según SemVer, y (c) propagar el
cambio a las plantillas dependientes (`plan`, `spec`, `tasks`) cuando aplique.

Política de versionado de la constitución:
- **MAJOR**: eliminación o redefinición incompatible de principios o gobernanza.
- **MINOR**: adición de un principio/sección o expansión material de guía existente.
- **PATCH**: aclaraciones, redacción, correcciones no semánticas.

Cumplimiento: cada plan de implementación DEBE incluir un "Constitution Check" que valide el diseño
frente a estos principios. La complejidad que viole un principio DEBE justificarse explícitamente o
rediseñarse.

**Version**: 1.2.0 | **Ratified**: 2026-07-11 | **Last Amended**: 2026-07-11
