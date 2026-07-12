// Server Component: inyecta JSON-LD en el HTML (SSG). Escapa "<" para evitar XSS
// (research §1.3). Usar dentro de Server Components; nunca client-side.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
