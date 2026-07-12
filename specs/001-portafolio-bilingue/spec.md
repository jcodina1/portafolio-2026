# Feature Specification: Portafolio bilingüe (perfil + venta de servicios a PYMEs)

**Feature Branch**: `001-portafolio-bilingue`

**Created**: 2026-07-11

**Status**: Draft

**Input**: Portafolio web bilingüe (ES/EN) de Juan Camilo Codina Ariza, desarrollador de
software. Igual prioridad para dos audiencias: reclutadores/CTOs que contratan (objetivo empleo
senior/lead) y dueños de PYMEs/SAS que compran soluciones (plataformas, automatización e IA,
sitios de alta conversión). La IA es hilo transversal (servicio, prueba, contenido y forma de
trabajar). Arquitectura híbrida: home one-pager premium + páginas dedicadas e indexables.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dueño de PYME agenda un diagnóstico o solicita un servicio (Priority: P1)

Un dueño o responsable de una PYME/SAS llega buscando quién le resuelva un problema operativo
(procesos manuales repetidos, herramientas desconectadas, una idea de software, o un sitio que
capte clientes). Reconoce su problema en una de las familias de servicio, entiende qué recibe y
el resultado, y toma la vía de conversión: idealmente el gancho "diagnóstico gratuito" (agenda
una llamada de 30 min) o el canal que prefiera (formulario, WhatsApp, email, LinkedIn).

**Why this priority**: Es el objetivo comercial y de ingresos. Sin esta ruta el sitio no capta
clientes.

**Independent Test**: Abrir la página de una familia de servicios, comprobar que cada paquete
comunica gancho → "qué recibes" → "resultado" → CTA, y completar una vía de contacto (agenda o
formulario) que llega al destino y muestra confirmación.

**Acceptance Scenarios**:

1. **Given** un visitante en una página de servicios, **When** revisa un paquete, **Then** ve el
   problema que resuelve, qué recibe, el resultado esperado y un CTA claro hacia el diagnóstico o
   el contacto.
2. **Given** un visitante que quiere hablar, **When** usa el gancho "diagnóstico gratuito",
   **Then** puede agendar una llamada de 30 minutos sin fricción.
3. **Given** un visitante que envía el formulario con datos válidos, **When** lo envía, **Then**
   el mensaje llega al autor y el visitante recibe confirmación visible.
4. **Given** un envío con datos inválidos, **When** intenta enviar, **Then** ve errores claros por
   campo y el envío no se realiza, conservando lo escrito.
5. **Given** un visitante en cualquier página comercial, **When** decide otro canal, **Then**
   dispone de accesos directos a WhatsApp, email y LinkedIn además del formulario y la agenda.

---

### User Story 2 - Reclutador/CTO evalúa al autor para contratarlo (Priority: P1)

Un reclutador o CTO llega (por búsqueda, LinkedIn o referencia) para evaluar si el autor encaja
en un rol senior/lead. Desde la home toma la ruta "para equipos que contratan", revisa el perfil
(experiencia, stack, liderazgo, forma de trabajar con IA) y los proyectos como prueba, y contacta
para una conversación de contratación.

**Why this priority**: La captación de empleo es un objetivo de igual prioridad que la venta de
servicios; ambas audiencias deben tener una ruta propia y clara.

**Independent Test**: Entrar por la home, seguir la bifurcación de contratación hasta el perfil,
comprobar que comunica experiencia/stack/liderazgo y ofrece una vía de contacto para contratar.

**Acceptance Scenarios**:

1. **Given** un visitante nuevo en la home, **When** ve la bifurcación dual, **Then** identifica
   de inmediato la ruta "para equipos que contratan" y la ruta "para negocios".
2. **Given** un reclutador en el perfil, **When** lo lee, **Then** encuentra rol y seniority,
   stack, experiencia/liderazgo, métricas y enlaces a LinkedIn y GitHub, con un CTA para hablar.

---

### User Story 3 - Visitante explora los proyectos como prueba (Priority: P2)

Cualquier visitante (cliente o reclutador) explora los proyectos para juzgar la calidad del
trabajo. Ve un listado de casos con el mismo peso visual y abre el detalle de uno para entender
problema → solución → resultado, con stack, capturas y enlaces cuando existan.

**Why this priority**: Refuerza credibilidad para ambas audiencias; secundario a las rutas de
conversión pero clave como prueba.

**Independent Test**: Abrir el listado de proyectos, ver los casos disponibles, abrir un detalle
y comprobar su contenido completo; los "próximamente" se distinguen claramente.

**Acceptance Scenarios**:

1. **Given** un visitante en proyectos, **When** ve el listado, **Then** encuentra los casos con
   título, resumen, rol y stack, y los "próximamente" señalados como tales.
2. **Given** un visitante que abre un proyecto, **When** ve el detalle, **Then** encuentra rol,
   stack, problema → solución → resultado, capturas y enlaces (demo/repositorio) si existen.

---

### User Story 4 - Cualquier visitante usa el sitio en su idioma (Priority: P2)

Un visitante hispanohablante o angloparlante usa todo el sitio en su idioma y puede alternar
ES/EN en cualquier momento, manteniéndose en la página equivalente; contenido, navegación y CTA
se muestran traducidos.

**Why this priority**: Transversal al objetivo de visibilidad (alcance internacional) y de
cercanía a las PYMEs locales; afecta a todas las páginas.

**Independent Test**: Cambiar el idioma en varias páginas y comprobar que todo el contenido
visible se traduce, no queda texto en el idioma opuesto, y la URL refleja el idioma manteniendo
la página equivalente.

**Acceptance Scenarios**:

1. **Given** una página en español, **When** cambia a inglés, **Then** la misma página se muestra
   en inglés (contenido, navegación y CTA) sin texto sin traducir.
2. **Given** un visitante que llega por un enlace en un idioma, **When** carga la página, **Then**
   el sitio se muestra en ese idioma y la URL lo refleja.

---

### User Story 5 - El sitio se posiciona en buscadores y es citado por LLMs (Priority: P2)

Un buscador o un asistente basado en LLM procesa el sitio. Cada página expone metadatos, vista
previa social y datos estructurados; existen páginas dedicadas por tema (familias de servicio,
casos, perfil) que dan superficie indexable, y la identidad del autor es consistente con sus
perfiles externos para favorecer la citación por LLMs.

**Why this priority**: Es un objetivo declarado ("posicionamiento espectacular en buscadores y
LLMs"); un one-pager no basta, de ahí la arquitectura híbrida.

**Independent Test**: Inspeccionar metadatos y datos estructurados de cada tipo de página,
validar la vista previa social, y comprobar sitemap, robots, `llms.txt`, canónicas y hreflang.

**Acceptance Scenarios**:

1. **Given** una página pública, **When** un buscador la indexa, **Then** encuentra título,
   descripción, URL canónica, variantes hreflang y datos estructurados adecuados al tipo (persona,
   servicio, caso).
2. **Given** un enlace compartido en una red social, **When** se genera la vista previa, **Then**
   muestra título, descripción e imagen representativos por idioma.
3. **Given** cada familia de servicio y cada proyecto, **When** se navega el sitio, **Then**
   tienen una URL propia indexable (no solo una sección con ancla).

---

### User Story 6 - El visitante elige tema claro u oscuro (Priority: P3)

Un visitante alterna entre tema claro y oscuro; su preferencia se recuerda y no hay parpadeo al
cargar. Ambos temas mantienen contraste accesible.

**Why this priority**: Parte de la experiencia premium y de la accesibilidad; secundaria frente a
contenido y conversión.

**Acceptance Scenarios**:

1. **Given** un visitante, **When** cambia el tema, **Then** el sitio cambia y recuerda la
   preferencia en visitas siguientes sin parpadeo inicial.
2. **Given** cualquier tema activo, **When** se revisa el contraste, **Then** cumple nivel AA.

---

### Edge Cases

- **Formulario**: si el envío falla temporalmente, el visitante ve un error claro y vías
  alternativas visibles (WhatsApp/email), sin perder lo escrito.
- **Spam**: los envíos automatizados se mitigan sin degradar al usuario legítimo.
- **Agenda externa no disponible**: si el servicio de agenda (Calendly) no carga, se ofrece una
  vía alternativa (formulario/WhatsApp) para no perder la conversión.
- **Sin proyectos personales todavía**: la sección se ve completa y profesional con los casos
  disponibles y/o "próximamente", sin huecos rotos ni capturas falsas hechas con divs.
- **Traducción faltante**: si una pieza no está traducida aún, se aplica un respaldo coherente
  (ver Assumptions) sin mostrar una página mezclada.
- **prefers-reduced-motion**: las animaciones (incl. formas del hero y parallax) colapsan a
  estático y el contenido sigue plenamente usable.
- **Teclado**: menú, selector de idioma, toggle de tema, formulario y todos los CTAs son operables
  solo con teclado y con foco visible.

## Requirements *(mandatory)*

### Functional Requirements

**Navegación, home y arquitectura de información**

- **FR-001**: El sitio DEBE ofrecer navegación global (sticky) con acceso a Perfil, Servicios,
  Proyectos y Contacto, un toggle de tema y un selector de idioma, con un CTA de contacto
  persistente.
- **FR-002**: La home DEBE presentar un hero con el nombre del autor y una propuesta de valor
  clara, con CTA primario ("Hablemos") y secundario ("Ver proyectos").
- **FR-003**: La home DEBE incluir una bifurcación dual explícita: "para equipos que contratan"
  (ruta empleo → perfil) y "para negocios que necesitan una solución" (ruta comercial → servicios).
- **FR-004**: La home DEBE incluir una banda de métricas (con cifras) y una banda "cómo trabajo
  con IA" que comunique la IA como parte de la forma de entregar (desarrollo asistido, automatización,
  integración de LLMs).
- **FR-005**: El sitio DEBE exponer, además de la home, páginas dedicadas e indexables por idioma
  para cada familia de servicio, para cada proyecto (detalle) y para el perfil.

**Perfil**

- **FR-006**: El sitio DEBE mostrar el perfil con biografía, foto, rol/seniority, habilidades/stack,
  experiencia y liderazgo, métricas y enlaces a perfiles profesionales (LinkedIn, GitHub), con un
  CTA de contacto orientado a contratación.

**Proyectos**

- **FR-007**: El sitio DEBE mostrar un listado de proyectos y un detalle por proyecto.
- **FR-008**: Cada proyecto DEBE poder incluir título, resumen, rol, stack, narrativa
  problema → solución → resultado, capturas (con placeholders con seed hasta tener reales) y
  enlaces (demo/repositorio) opcionales.
- **FR-009**: El sistema DEBE soportar proyectos de dos orígenes (empresa y personales) y permitir
  marcar proyectos como "próximamente". La v1 incluye 4 casos: plataforma de gestión comercial y
  financiera (WindMar Home), plataforma de simulación financiera con mapas (freelance), Website 2.0
  + landings de alta conversión (WindMar Home) y **este mismo portafolio** (proyecto personal:
  Next.js 16, i18n ES/EN, GSAP, SEO/GEO, construido con Spec Kit) como demostración meta de la
  forma de trabajar del autor.

**Servicios (conversión, por paquetes)**

- **FR-010**: El sitio DEBE presentar los servicios organizados en cuatro familias, cada una con
  sus paquetes: (1) Automatización e IA (Automatiza 1, Operación Conectada, Asistente IA/RAG);
  (2) Plataformas y herramientas a medida (MVP en 6 semanas, Plataforma a medida); (3) Sitios y
  landings que convierten (Landing Express, Sitio Pro); (4) Soporte continuo (Cuidado, Flujos
  Gestionados).
- **FR-011**: Cada paquete DEBE comunicar el problema de negocio, "qué recibes" (entregables) y
  el "resultado", con un CTA hacia contacto/diagnóstico.
- **FR-012**: El sitio DEBE ofrecer un gancho de entrada "diagnóstico gratis" (llamada de 30
  min) accesible desde las páginas comerciales, con la etiqueta de CTA única "Agenda tu diagnóstico
  gratis".
- **FR-013**: Los servicios NO muestran precios; el CTA conduce a diagnóstico/presupuesto.

**Contacto (multicanal)**

- **FR-014**: El sitio DEBE ofrecer un formulario de contacto que haga llegar el mensaje al autor.
- **FR-015**: El formulario DEBE validar la entrada en cliente y servidor y mostrar errores claros
  por campo.
- **FR-016**: El formulario DEBE confirmar el envío correcto y mostrar un error accionable si
  falla, preservando lo escrito.
- **FR-017**: El endpoint de contacto DEBE incorporar protección anti-abuso/spam.
- **FR-018**: El sitio DEBE ofrecer, además del formulario, agenda (Calendly para el diagnóstico),
  WhatsApp, email directo y LinkedIn.

**Bilingüismo (ES/EN)**

- **FR-019**: Todo el contenido visible DEBE estar disponible en español e inglés; ningún texto
  visible puede estar fijado sin posibilidad de traducción.
- **FR-020**: El sitio DEBE permitir cambiar de idioma en cualquier página manteniendo la página
  equivalente y reflejando el idioma en la URL.
- **FR-021**: Ambos idiomas DEBEN mantener paridad de contenido.

**Visibilidad / SEO / GEO**

- **FR-022**: Cada página pública DEBE exponer metadatos (título, descripción), datos para vista
  previa social y URL canónica por idioma con hreflang.
- **FR-023**: El sitio DEBE publicar sitemap, robots y `llms.txt`, y datos estructurados por tipo
  (Person para el perfil, Service/Offer para servicios, casos para proyectos, BreadcrumbList y
  FAQPage donde aplique).
- **FR-024**: La identidad del autor DEBE ser consistente con sus perfiles externos (nombre,
  título, bio y enlaces `sameAs`) para favorecer buscadores y citación por LLMs.

**Accesibilidad, tema y diseño**

- **FR-025**: El sitio DEBE cumplir WCAG 2.2 AA (semántico, teclado con foco visible, contraste
  suficiente en ambos temas, textos alternativos).
- **FR-026**: El sitio DEBE respetar `prefers-reduced-motion`, colapsando a estático las
  animaciones no esenciales.
- **FR-027**: El sitio DEBE ofrecer tema claro y oscuro persistente y sin parpadeo inicial.
- **FR-028**: El sitio DEBE presentar un diseño intencional y premium (no plantilla) coherente en
  ambos idiomas y temas, con un único color de acento y sin los "tells" de IA definidos en la
  constitución.

**Contenido gestionable y pendiente**

- **FR-029**: El contenido (perfil, proyectos, servicios, cadenas de idioma) DEBE ser gestionable
  como datos/MDX sin modificar componentes.
- **FR-030**: Los datos aún no disponibles DEBEN ser incorporables como contenido sin cambios de
  código: traducciones al inglés (el copy nace en español), capturas reales de proyectos, número
  de WhatsApp y enlace de agenda. No se inventan datos; hasta tenerlos se usan marcadores
  identificables.

**Seguridad**

- **FR-031**: El sitio DEBE servir una Content Security Policy (CSP) en producción y cabeceras de
  seguridad (HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, control de
  framing). La CSP DEBE permitir explícitamente los orígenes de terceros usados (agenda Calendly) y
  nada más.
- **FR-032**: NINGÚN secreto (claves de API, tokens) puede quedar expuesto en el bundle del cliente;
  solo variables `NEXT_PUBLIC_*` no sensibles llegan al navegador.
- **FR-033**: El endpoint de contacto DEBE validar en servidor, mitigar abuso sin fricción (honeypot
  + time-trap, sin estado) y no revelar información sensible en los errores.
- **FR-034**: Los scripts de terceros (Calendly) DEBEN cargarse de forma diferida y acotada por CSP;
  todo enlace externo con `rel="noopener noreferrer"`. Las dependencias se mantienen actualizadas.

**Rendimiento y estados de carga**

- **FR-035**: El sitio DEBE priorizar la velocidad: renderizado estático (SSG) por defecto,
  división de código, diferido de lo no crítico e hidratación mínima. Los objetivos medibles están
  en Success Criteria (SC-005).
- **FR-036**: Toda operación asíncrona o contenido que tarde en aparecer (envío del formulario,
  apertura de la agenda, transición de ruta, carga diferida de una sección o imagen) DEBE mostrar un
  estado de carga (skeleton o indicador), nunca UI en blanco o congelada. Las rutas DEBEN tener UI de
  carga a nivel de segmento.

### Key Entities *(include if feature involves data)*

- **Perfil (Autor)**: Juan Camilo Codina Ariza. Atributos: nombre, título/seniority, bio (ES/EN),
  foto, stack, experiencia/liderazgo, métricas, enlaces (`sameAs`), contacto público.
- **Proyecto**: caso de trabajo. Atributos: título, resumen, rol, stack, problema, solución,
  resultado, capturas, enlaces, origen (empresa/personal), estado (publicado/próximamente), idioma.
- **Familia de servicio**: agrupación comercial (Automatización e IA; Plataformas a medida; Sitios
  y landings; Soporte continuo). Tiene su propia página indexable.
- **Paquete de servicio**: oferta concreta dentro de una familia. Atributos: nombre, gancho,
  problema, "qué recibes" (entregables), "resultado", CTA.
- **Mensaje de contacto**: solicitud entrante. Atributos: nombre, email, mensaje, contexto (servicio
  de interés), marca temporal, estado de entrega.
- **Recurso de idioma**: contenido/cadenas traducidas por idioma (ES/EN) que alimenta el sitio.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un dueño de PYME puede pasar de la home a iniciar una conversión (agenda o contacto)
  en 3 clics o menos.
- **SC-002**: Un reclutador puede pasar de la home al perfil y a una vía de contacto de
  contratación en 2 clics o menos.
- **SC-003**: El 95% de los envíos de contacto válidos llega al autor y muestra confirmación.
- **SC-004**: Un visitante puede cambiar de idioma en cualquier página y ver el 100% del contenido
  visible traducido, sin texto en el idioma opuesto.
- **SC-005**: Las páginas principales cargan su contenido principal en menos de 2,5 s y sin saltos
  de diseño perceptibles en una conexión típica.
- **SC-006**: El 100% de las páginas públicas superan una comprobación automatizada de
  accesibilidad sin errores de nivel AA, en ambos temas.
- **SC-007**: El 100% de las páginas públicas exponen metadatos completos, datos estructurados por
  tipo y vista previa social válida en ambos idiomas.
- **SC-008**: Cada familia de servicio y cada proyecto tienen una URL propia indexable.
- **SC-009**: El sitio es completamente operable solo con teclado (menú, idioma, tema, formulario,
  CTAs).
- **SC-010**: Añadir un proyecto o un paquete de servicio se realiza editando contenido/datos, sin
  modificar componentes.
- **SC-011**: Cero secretos expuestos en el bundle del cliente; todas las páginas responden con CSP
  y cabeceras de seguridad presentes (verificable con un escaneo de cabeceras).
- **SC-012**: Toda acción asíncrona muestra un estado de carga en menos de 100 ms; nunca hay
  pantalla en blanco ni interfaz congelada mientras algo carga.

## Assumptions

- **Stack e infraestructura** (restricción dada): Next.js (App Router) + React + TypeScript +
  Tailwind + shadcn/ui en Vercel; `next-themes` para temas; GSAP + ScrollTrigger para motion; hero
  3D con CSS 3D transforms; formulario con función serverless + email transaccional; agenda vía
  Calendly (o equivalente).
- **Sin base de datos**: el contenido son archivos versionados (datos + MDX) y el sitio es estático
  (SSG). El anti-spam del formulario es **sin estado** (honeypot + time-trap), con firewall/BotID de
  Vercel como refuerzo opcional; no se usa Redis/base de datos externa.
- **Seguridad**: CSP + cabeceras de seguridad en producción; secretos solo en variables de entorno
  del servidor; el propio portafolio es también un caso de estudio en la sección de Proyectos.
- **Arquitectura híbrida**: home one-pager + páginas indexables de servicios/proyectos/perfil;
  blog en fase 2 con la arquitectura preparada.
- **Precios**: los servicios se presentan por paquetes con nombre pero SIN precios visibles; la
  conversión es vía diagnóstico/presupuesto. (Clarificación resuelta.)
- **Blog**: fuera de la v1; la arquitectura no debe impedir añadirlo después. (Clarificación
  resuelta; el autor puede decidir incluir 1-2 artículos fundacionales más adelante.)
- **Idioma/contenido**: el copy nace en español; las traducciones al inglés las aporta/aprueba el
  autor. Respaldo transitorio: si una pieza no está traducida, se muestra el español señalando su
  estado, nunca una página mezclada.
- **Analítica**: se integra una herramienta de analítica web respetuosa con la privacidad para
  medir el objetivo de visibilidad.
- **Datos personales**: identidad y proyectos de empresa ya conocidos; pendientes de aportar por el
  autor: traducciones EN, capturas reales, número de WhatsApp y enlace de agenda.
- **Negocio**: el objetivo es generar solicitudes cualificadas (empleo y clientes); contratación y
  pago se gestionan fuera del sitio.
