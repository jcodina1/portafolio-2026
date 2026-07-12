import { Resend } from "resend";
import { contactSchema, type ContactState } from "./contact-schema";

// Lógica pura del contacto (reusable desde Server Action y, si hiciera falta, un
// Route Handler). Anti-spam SIN estado: honeypot + time-trap. Sin Redis.
const MIN_FILL_MS = 3000;

export async function processContact(raw: unknown): Promise<ContactState> {
  const d = (raw ?? {}) as Record<string, unknown>;

  // 1) Honeypot -> éxito falso, silencioso (no revelar el mecanismo)
  if (typeof d.company === "string" && d.company.length > 0) {
    return { ok: true };
  }

  // 2) Time-trap: envíos demasiado rápidos son bots
  const startedAt = Number(d.startedAt ?? 0);
  if (startedAt && Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: true };
  }

  // 3) Validación de servidor (misma fuente de verdad)
  const parsed = contactSchema.safeParse(d);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "root");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  const { nombre, email, tipo, mensaje } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  // Sin configuración de email todavía: no crashea, informa y ofrece alternativa.
  if (!apiKey || !to || !from) {
    console.warn("[contact] Falta configuración de email (RESEND_API_KEY / CONTACT_*). Envío omitido.");
    return {
      ok: false,
      message: "El envío por formulario aún no está configurado. Escríbeme por WhatsApp o email.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[${tipo}] Nuevo contacto de ${nombre}`,
      text: `De: ${nombre} <${email}>\nMotivo: ${tipo}\n\n${mensaje}`,
    });
    return { ok: true };
  } catch (error) {
    console.error("[contact] Error al enviar:", error);
    return {
      ok: false,
      message: "No se pudo enviar en este momento. Escríbeme por WhatsApp o reintenta.",
    };
  }
}
