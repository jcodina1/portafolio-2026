import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Navegación tipada (Link/redirect/usePathname/useRouter) que respeta los
// pathnames localizados de routing.ts.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
