import type { Person, WebSite, WithContext } from "schema-dts";
import { SITE_URL } from "./metadata";
import type { Profile } from "@/content/schema";

// Builders de JSON-LD. US5 (T071-T072) los enlaza en un @graph con @id estables.
export const PERSON_ID = `${SITE_URL}/#person`;

export function websiteJsonLd(locale: string): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Juan Camilo Codina Ariza",
    inLanguage: locale,
  };
}

export function personJsonLd(profile: Profile): WithContext<Person> {
  const sameAs = [profile.links.linkedin, profile.links.github].filter(
    (v): v is string => Boolean(v),
  );
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    jobTitle: profile.title,
    description: profile.bioShort,
    sameAs,
  };
}
