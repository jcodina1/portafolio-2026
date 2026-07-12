import type { MDXComponents } from "mdx/types";

// Requerido por @next/mdx en App Router. Los componentes MDX permitidos se
// añaden aquí (design-system: sin lógica de UI en el MDX, solo prosa + primitivos).
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
