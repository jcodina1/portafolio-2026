import { describe, it, expect } from "vitest";
import { processContact } from "@/lib/contact";

const valid = {
  nombre: "Juan",
  email: "test@example.com",
  tipo: "servicio",
  mensaje: "Hola, me interesa un proyecto de automatización.",
};

describe("processContact anti-spam", () => {
  it("honeypot lleno -> éxito silencioso, sin enviar", async () => {
    const res = await processContact({ ...valid, company: "bot", startedAt: Date.now() - 5000 });
    expect(res.ok).toBe(true);
  });

  it("time-trap (<3s) -> éxito silencioso", async () => {
    const res = await processContact({ ...valid, company: "", startedAt: Date.now() });
    expect(res.ok).toBe(true);
  });
});

describe("processContact validación", () => {
  it("datos inválidos -> errores por campo", async () => {
    const res = await processContact({
      nombre: "",
      email: "no-es-email",
      tipo: "servicio",
      mensaje: "corto",
      company: "",
      startedAt: Date.now() - 5000,
    });
    expect(res.ok).toBe(false);
    if (!res.ok && "errors" in res) {
      expect(Object.keys(res.errors).length).toBeGreaterThan(0);
    } else {
      throw new Error("esperaba errores de validación");
    }
  });

  it("datos válidos sin config de email -> mensaje accionable (no crashea)", async () => {
    const res = await processContact({ ...valid, company: "", startedAt: Date.now() - 5000 });
    // En test no hay RESEND_API_KEY -> devuelve { ok:false, message } de forma controlada.
    expect(res.ok).toBe(false);
    if (!res.ok && "message" in res) {
      expect(typeof res.message).toBe("string");
    }
  });
});
