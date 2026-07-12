# Contract: Envío de contacto

**Feature**: `001-portafolio-bilingue` · **Fase 1** · Ver [research.md](../research.md) §4.

Interfaz principal expuesta por el sitio (además de las páginas HTML): el envío del formulario de
contacto. Implementación por **Server Action** (`app/actions/contact.ts`) que delega en la función
pura `lib/contact.ts` (`processContact`). Un Route Handler `POST /api/contact` es **variante
opcional** solo si se necesita endpoint HTTP público (misma función pura).

## Entrada (payload)

```jsonc
{
  "nombre": "string 2..80",        // requerido
  "email": "email",                 // requerido -> replyTo
  "tipo": "empleo|servicio|otro",   // requerido (segmenta el lead)
  "mensaje": "string 10..2000",     // requerido
  "company": "string",              // honeypot: DEBE venir vacío (fuera del zod schema)
  "startedAt": 0                     // time-trap: epoch ms de apertura (fuera del zod schema)
}
```

Validación con `contactSchema` (zod) **compartido** cliente/servidor. El servidor **siempre**
re-valida con `safeParse`. `company` y `startedAt` se leen aparte (no en el schema, porque
`zodResolver` descarta claves desconocidas).

## Pipeline de procesamiento (orden estricto)

1. **Honeypot**: si `company` no vacío → responder `{ ok: true }` (éxito falso, no revelar).
2. **Time-trap**: si `Date.now() - startedAt < 3000ms` → `{ ok: true }` (éxito falso).
3. **Rate limit (opcional, a nivel de plataforma)**: Vercel Firewall/BotID (sin código ni estado en
   la app). No se usa Redis/Upstash. Las capas 1 y 2 (honeypot + time-trap) son las defensas por
   defecto, sin estado y sin fricción.
4. **Validación** `safeParse` → si falla, `{ ok: false, errors: { campo: mensaje } }`.
5. **Envío** con Resend: `from` = dominio verificado, `replyTo` = email del visitante, asunto
   `[{tipo}] Nuevo contacto de {nombre}`. Opcional: autorespuesta al visitante.
6. Éxito → `{ ok: true }`.

## Respuestas (contrato de estado)

```ts
type ContactState =
  | { ok: true }
  | { ok: false; errors: Record<string, string> }   // errores por campo (422)
  | { ok: false; message: string };                  // error global accionable (429 / 500)
```

| Situación | Respuesta | UI |
|-----------|-----------|-----|
| Éxito | `{ ok: true }` | Reemplazar form por estado "gracias" (`aria-live`) + CTA Calendly |
| Validación falla | `{ ok:false, errors }` | `form.setError(campo)`; no limpiar el form |
| Rate limit | `{ ok:false, message }` | `role="alert"`; ofrecer WhatsApp/email |
| Fallo de envío | `{ ok:false, message }` | `role="alert"`; preservar lo escrito; alternativas visibles |

## Variables de entorno (server-only salvo `NEXT_PUBLIC_*`)

`RESEND_API_KEY`, `CONTACT_FROM_EMAIL` (dominio verificado SPF/DKIM/DMARC), `CONTACT_TO_EMAIL`;
públicas: `NEXT_PUBLIC_CALENDLY_URL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_CONTACT_EMAIL`,
`NEXT_PUBLIC_LINKEDIN_URL`. (Sin variables de Redis/Upstash: el anti-spam es sin estado.)

## Canales directos (contrato de enlaces)

| Canal | Formato |
|-------|---------|
| WhatsApp | `https://wa.me/<solo-dígitos>?text=<encodeURIComponent>` (sin `+`/espacios/`0` inicial) |
| Teléfono | `tel:+<E.164>` |
| Email | `mailto:<addr>?subject=<encoded>` (cuerpo corto) |
| LinkedIn | URL de perfil, `target=_blank` + `rel="noopener noreferrer"` |
| Calendly | popup diferido (`react-calendly`) + enlace directo como fallback |

## Criterios de aceptación (verificables)

- Envío válido → llega el email al `CONTACT_TO_EMAIL` con `replyTo` correcto y el visitante ve
  confirmación (cubre SC-003, FR-014/016).
- Datos inválidos → errores por campo, sin envío, sin perder lo escrito (FR-015).
- Honeypot lleno o envío < 3s → tratado como éxito silencioso, sin email enviado (FR-017, FR-033).
- Abuso sostenido → mitigado por el firewall/BotID de Vercel (plataforma), sin estado en la app.
- Sin secretos en el bundle cliente (solo `NEXT_PUBLIC_*`).
