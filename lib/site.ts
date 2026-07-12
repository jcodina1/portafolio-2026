// Datos de contacto públicos (no sensibles). Se leen de env con fallback a los
// valores conocidos del autor. WhatsApp y Calendly quedan vacíos hasta que el
// autor los provea (los botones se ocultan o degradan con gracia).
export const site = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "jcodina1997@gmail.com",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/jcodina1",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
} as const;
