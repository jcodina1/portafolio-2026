<!--
SYNC IMPACT REPORT
Version change: (template) → 1.0.0
Bump rationale: Initial ratification of the project constitution (first concrete version).
Modified principles: N/A (initial adoption)
Added principles:
  I. Visibilidad y SEO primero
  II. Orientación a conversión
  III. Accesibilidad WCAG 2.2 AA (NO NEGOCIABLE)
  IV. Rendimiento (Performance Budgets)
  V. Internacionalización real ES/EN
  VI. Calidad de código y diseño intencional
  VII. Contenido gestionable como datos
Added sections: Restricciones Técnicas; Flujo de Trabajo y Puertas de Calidad; Governance
Removed sections: None
Templates status:
  ✅ .specify/templates/plan-template.md (Constitution Check reads this file dynamically — no hardcoded gates)
  ✅ .specify/templates/spec-template.md (no constitution-specific edits required)
  ✅ .specify/templates/tasks-template.md (principle-driven task types covered by generic categories)
Deferred TODOs: None
-->

# Portafolio Constitution

Portafolio personal bilingüe (ES/EN) de un desarrollador de software. Doble propósito:
(1) mostrar el perfil profesional del autor y aumentar su visibilidad, y (2) vender servicios
de desarrollo de software a empresas pequeñas (PYMEs) que necesitan soluciones de gestión.
Stack: Next.js (App Router) + React + TypeScript + Tailwind + shadcn/ui, desplegado en Vercel.

## Core Principles

### I. Visibilidad y SEO primero
El sitio DEBE ser encontrable y compartible. Cada página pública DEBE definir metadatos
completos (`title`, `description`), etiquetas Open Graph y Twitter Card, y datos estructurados
JSON-LD apropiados (`Person` para el perfil, `Service`/`Offer` para servicios, `WebSite`).
El proyecto DEBE generar `sitemap.xml` y `robots.txt` automáticamente y mantener URLs
canónicas estables. Ninguna página comercial o de contenido puede publicarse sin sus metadatos.
Rationale: la visibilidad es un objetivo primario del producto; sin descubribilidad el portafolio
no cumple su función de captación.

### II. Orientación a conversión
Toda página comercial (Servicios, y la home) DEBE guiar al visitante PYME hacia un CTA claro y
único por vista (contacto / solicitud de presupuesto). La sección de Servicios se trata como una
landing de ventas, no como una página meramente informativa: propuesta de valor, prueba social o
casos, y llamada a la acción visible sin necesidad de scroll excesivo. Los formularios de contacto
DEBEN confirmar el envío y manejar errores de forma explícita y amable.
Rationale: vender a PYMEs es un objetivo primario; una página bonita sin ruta de conversión
desperdicia el tráfico obtenido por el Principio I.

### III. Accesibilidad WCAG 2.2 AA (NO NEGOCIABLE)
Todo componente y página DEBE cumplir WCAG 2.2 nivel AA: HTML semántico, navegación completa por
teclado con foco visible, contraste de color suficiente, textos alternativos en imágenes con
contenido, y respeto a `prefers-reduced-motion` (las animaciones no esenciales se desactivan).
Los elementos interactivos DEBEN tener nombres accesibles. Este principio no se pospone ni se
negocia por plazos.
Rationale: la accesibilidad amplía la audiencia, es requisito legal en muchos mercados y es señal
directa de la calidad profesional que el autor vende.

### IV. Rendimiento (Performance Budgets)
El sitio DEBE cumplir objetivos Core Web Vitals en producción: LCP < 2.5s, INP < 200ms, CLS < 0.1.
Las animaciones DEBEN usar solo propiedades compositor-friendly (`transform`, `opacity`,
`clip-path`); está prohibido animar propiedades que fuerzan layout (`width`, `height`, `top`,
`left`, `margin`). Las imágenes DEBEN servirse en AVIF/WebP con dimensiones explícitas y
`next/image`, priorizando solo el hero (`priority`) y difiriendo el resto. Las bibliotecas pesadas
se importan de forma dinámica. Presupuesto de JS de página de aterrizaje objetivo < 150 KB gzip.
Rationale: el rendimiento afecta directamente al SEO (Principio I), la conversión (Principio II) y
la percepción de competencia técnica del autor.

### V. Internacionalización real ES/EN
El sitio es bilingüe español/inglés. NINGÚN texto visible puede estar hardcodeado en los
componentes: todo el copy DEBE provenir de recursos de traducción por idioma. Las rutas DEBEN estar
localizadas y cada página DEBE exponer `hreflang` y una URL canónica por idioma. Ambos idiomas
DEBEN mantener paridad de contenido; una cadena sin traducir es un defecto, no un detalle estético.
Rationale: el objetivo de visibilidad exige alcance internacional sin sacrificar cercanía a las
PYMEs hispanohablantes.

### VI. Calidad de código y diseño intencional
TypeScript en modo estricto (sin `any` implícito). Los archivos se mantienen < 800 líneas y las
funciones < 50 líneas; la anidación no supera 4 niveles (usar retornos tempranos). Se prefieren
patrones inmutables: construir nuevos objetos en vez de mutar. Los tokens de diseño (color,
tipografía, espaciado, duración) viven como custom properties CSS / config de Tailwind; NADA de
valores de diseño repetidos y hardcodeados. La UI DEBE ser intencional y NO parecer una plantilla
por defecto (jerarquía, ritmo y estados hover/focus/active diseñados).
Rationale: el propio sitio es la mejor demostración de la habilidad que el autor vende; código y
diseño descuidados contradicen la propuesta comercial.

### VII. Contenido gestionable como datos
La información personal, los proyectos y los servicios DEBEN vivir en datos estructurados o MDX
editables (una única fuente de verdad por idioma), separados de la lógica de presentación. Añadir
un proyecto, un servicio o actualizar la bio NO DEBE requerir modificar componentes de React.
Rationale: permite iterar el contenido con rapidez, reduce el riesgo de regresiones y mantiene la
cohesión del Principio VI.

## Restricciones Técnicas

- **Stack fijo**: Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui.
- **Hosting**: Vercel. El código no asume infraestructura fuera de las capacidades de Vercel
  (funciones serverless para formularios, imágenes optimizadas, edge).
- **Secretos**: ninguna clave/API/token se hardcodea; se usan variables de entorno. El repositorio
  no contiene `.env` con secretos reales.
- **Datos de formularios**: validación en cliente y servidor; protección anti-abuso (honeypot o
  rate limiting) en el endpoint de contacto.
- **Organización de archivos**: por dominio/feature (no por tipo), muchos archivos pequeños y
  cohesivos.

## Flujo de Trabajo y Puertas de Calidad

- El desarrollo sigue el flujo de Spec Kit: constitution → specify → (clarify) → plan → tasks →
  (analyze) → implement.
- Antes de considerar una feature completa DEBE verificarse: build de producción sin errores,
  TypeScript sin errores, metadatos/SEO presentes, comprobación de accesibilidad (teclado +
  contraste + reduced-motion), y paridad de idiomas ES/EN.
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

**Version**: 1.0.0 | **Ratified**: 2026-07-11 | **Last Amended**: 2026-07-11
