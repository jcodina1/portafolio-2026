import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

// Geist (cuerpo) + Geist Mono (etiquetas/métricas), self-hosted vía el paquete `geist`.
// Clash Display (titulares): PENDIENTE el archivo woff2 en `public/fonts/` para
// wire con `next/font/local` (ver design-system §1 y tarea del hero US2). Hasta
// entonces, `--font-display` cae a Geist en globals.css sin romper el build.
export const fontVariables = `${GeistSans.variable} ${GeistMono.variable}`;
