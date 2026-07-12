import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Convención "proxy" de Next 16 (antes "middleware"). Enruta i18n con next-intl.
export default createMiddleware(routing);

export const config = {
  // Excluye api, assets internos y cualquier archivo con extensión
  // (sitemap.xml, robots.txt, llms.txt, imágenes, etc.) para no redirigirlos.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
