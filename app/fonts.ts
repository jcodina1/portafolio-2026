import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";

// Geist (cuerpo) + Geist Mono (etiquetas/métricas) vía el paquete `geist`.
// Clash Display (titulares) self-hosteado con next/font/local desde el woff2
// VARIABLE (un solo archivo, pesos 200-700). Fuente en `fonts/` (no en public/,
// para que next/font la sirva optimizada sin duplicar).
const clashDisplay = localFont({
  src: "../fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash",
  weight: "200 700",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const fontVariables = `${GeistSans.variable} ${GeistMono.variable} ${clashDisplay.variable}`;
