# Contract: Contenido gestionable (datos + MDX)

**Feature**: `001-portafolio-bilingue` · **Fase 1** · Entidades en [data-model.md](../data-model.md).

Contrato que **el autor/editor** debe cumplir para añadir o cambiar contenido **sin tocar
componentes** (Principio VII, FR-029, SC-010). Los loaders viven en `lib/content/*` (patrón
repositorio); los esquemas zod en `content/schema.ts` son la puerta de validación.

## Disposición de archivos

```text
content/
├── es/
│   ├── perfil.ts                 # export default profileSchema.parse({...})
│   ├── servicios/
│   │   ├── automatizacion-ia.ts  # serviceFamily
│   │   ├── plataformas.ts
│   │   ├── sitios.ts
│   │   └── soporte.ts
│   └── proyectos/
│       ├── windmar-plataforma.mdx
│       ├── simulacion-financiera.mdx
│       └── web-2-0.mdx
└── en/  └─ (misma estructura; slugs equivalentes localizados)

messages/{es,en}.json             # cadenas de UI (next-intl)
public/fonts/*.woff2 · public/llms.txt · public/images/...
```

## Reglas del contrato

1. **Paridad por `id`/`slug`**: cada ítem existe en `es/` y `en/` con el mismo `id`. El slug puede
   localizarse (`proyectos`↔`projects`) pero se empareja por `id`.
2. **ES obligatorio, EN auditado**: un ítem `status: published` sin su versión EN **rompe el build**
   (`scripts/check-content.ts`). Un ítem no publicado puede caer a ES con marcador visible.
3. **Validación zod en build**: todo archivo se `parse`a; campos faltantes o inválidos rompen el
   build. `alt` de imágenes y `href` de CTA son obligatorios; enlaces validados como URL.
4. **Sin lógica de UI en MDX**: los `.mdx` contienen prosa (y componentes MDX permitidos), nunca
   lógica de presentación.
5. **Cadenas de UI**: van en `messages/*.json`, no en el contenido de dominio; claves con paridad
   total ES/EN.

## Front-matter MDX de proyecto (ejemplo, campos = data-model)

```yaml
---
title: "Plataforma de gestión comercial y financiera"
slug: "windmar-plataforma"
summary: "Arquitectura por capas con pagos e integración a CRM."
role: "Líder de desarrollo"
stack: ["Next.js", "TypeScript", "REST API", "PostgreSQL"]
problem: "..."      # resumen; narrativa ampliada en el cuerpo MDX
solution: "..."
result: "..."
screenshots:
  - { src: "/images/windmar/panel.png", alt: "Panel de gestión comercial" }
links: { demo: "https://...", repo: "" }
origin: "company"
status: "published"
order: 1
---

Cuerpo MDX: narrativa problema → solución → resultado.
```

## Validación (`scripts/check-content.ts`, en `prebuild`/CI)

- Parsea cada archivo con su esquema zod (falla en campo faltante/ inválido).
- Verifica paridad ES↔EN de ítems `published` (falla si falta EN).
- Verifica paridad de slugs/ids y de claves de `messages/*.json`.
- Verifica `alt` presentes y `links.*` como URL.

## Criterios de aceptación

- Añadir un proyecto = crear `content/es/proyectos/<slug>.mdx` (+ EN si `published`); aparece en el
  listado y en su URL sin editar componentes (SC-010, SC-008).
- Añadir un paquete de servicio = editar el `.ts` de su familia; sin tocar componentes.
- Publicar con contenido incompleto o sin EN → el build falla con un error legible.
