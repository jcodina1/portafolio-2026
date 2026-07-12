"use server";

import { processContact } from "@/lib/contact";
import type { ContactState } from "@/lib/contact-schema";

export async function sendContact(raw: unknown): Promise<ContactState> {
  return processContact(raw);
}
