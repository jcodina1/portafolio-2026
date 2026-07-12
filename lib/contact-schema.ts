import { z } from "zod";

// Esquema base compartido cliente/servidor (mensajes neutros; el cliente construye
// una variante con mensajes traducidos vía next-intl). honeypot (`company`) y
// `startedAt` van FUERA del schema a propósito (zodResolver descarta claves extra).
export const contactSchema = z.object({
  nombre: z.string().min(2).max(80),
  email: z.string().email(),
  tipo: z.enum(["empleo", "servicio", "otro"]),
  mensaje: z.string().min(10).max(2000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState =
  | { ok: true }
  | { ok: false; errors: Record<string, string> }
  | { ok: false; message: string };
