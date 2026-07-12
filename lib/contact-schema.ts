import { z } from "zod";

// Esquema base compartido cliente/servidor (mensajes neutros; el cliente construye
// una variante con mensajes traducidos vía next-intl). honeypot (`company`) y
// `startedAt` van FUERA del schema a propósito (zodResolver descarta claves extra).
// Límites compartidos (fuente única para el schema de servidor y el de cliente).
export const LIMITS = {
  nombreMin: 2,
  nombreMax: 80,
  mensajeMin: 10,
  mensajeMax: 2000,
} as const;

export const contactSchema = z.object({
  nombre: z.string().min(LIMITS.nombreMin).max(LIMITS.nombreMax),
  email: z.string().email(),
  tipo: z.enum(["empleo", "servicio", "otro"]),
  mensaje: z.string().min(LIMITS.mensajeMin).max(LIMITS.mensajeMax),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState =
  | { ok: true }
  | { ok: false; errors: Record<string, string> }
  | { ok: false; message: string };
