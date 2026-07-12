"use client";

import { useTranslations } from "next-intl";
import { WhatsappLogo, EnvelopeSimple, LinkedinLogo, Phone } from "@phosphor-icons/react";
import { site } from "@/lib/site";

const linkClass =
  "inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function ChannelButtons() {
  const t = useTranslations("contact.channels");
  const waText = encodeURIComponent(t("whatsappPrefill"));

  return (
    <div className="flex flex-wrap gap-3">
      {site.whatsapp && (
        <a
          href={`https://wa.me/${site.whatsapp}?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <WhatsappLogo size={18} weight="bold" aria-hidden="true" /> WhatsApp
        </a>
      )}
      <a href={`mailto:${site.email}`} className={linkClass}>
        <EnvelopeSimple size={18} weight="bold" aria-hidden="true" /> Email
      </a>
      {site.whatsapp && (
        <a href={`tel:+${site.whatsapp}`} className={linkClass}>
          <Phone size={18} weight="bold" aria-hidden="true" /> {t("call")}
        </a>
      )}
      <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
        <LinkedinLogo size={18} weight="bold" aria-hidden="true" /> LinkedIn
      </a>
    </div>
  );
}
