"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { sendContact } from "@/app/actions/contact";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendlyPopup } from "./CalendlyPopup";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("contact");
  const tc = useTranslations("cta");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const startedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const schema = z.object({
    nombre: z.string().min(2, { message: t("errors.name") }).max(80),
    email: z.string().email({ message: t("errors.email") }),
    tipo: z
      .string()
      .refine((v) => ["empleo", "servicio", "otro"].includes(v), {
        message: t("errors.type"),
      }),
    mensaje: z.string().min(10, { message: t("errors.message") }).max(2000),
  });
  type Values = z.infer<typeof schema>;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", email: "", tipo: "", mensaje: "" },
  });

  async function onSubmit(values: Values) {
    setStatus("submitting");
    setErrorMsg("");
    const res = await sendContact({
      ...values,
      company: honeypotRef.current?.value ?? "",
      startedAt: startedAt.current,
    });
    if (res.ok) {
      form.reset();
      setStatus("success");
      return;
    }
    if ("errors" in res) {
      for (const [field, message] of Object.entries(res.errors)) {
        form.setError(field as keyof Values, { message });
      }
      setStatus("idle");
      return;
    }
    setErrorMsg(res.message);
    setStatus("error");
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border border-border bg-card p-6"
      >
        <h3 className="font-display text-xl font-semibold">{t("form.successTitle")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("form.successBody")}</p>
        <div className="mt-5">
          <CalendlyPopup
            label={tc("diagnostico")}
            className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform active:scale-[0.98]"
          />
        </div>
      </div>
    );
  }

  const selectClass =
    "flex h-10 w-full rounded-[10px] border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Honeypot: oculto también para lectores de pantalla */}
        <input
          ref={honeypotRef}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="sr-only"
        />

        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.name")}</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.email")}</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.type")}</FormLabel>
              <FormControl>
                <select
                  className={selectClass}
                  name={field.name}
                  ref={field.ref}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                >
                  <option value="" disabled>
                    {t("form.typePlaceholder")}
                  </option>
                  <option value="empleo">{t("form.typeEmpleo")}</option>
                  <option value="servicio">{t("form.typeServicio")}</option>
                  <option value="otro">{t("form.typeOtro")}</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mensaje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.message")}</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {status === "error" && (
          <p role="alert" className="text-sm text-destructive">
            {t("form.errorTitle")}: {errorMsg}
          </p>
        )}

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full"
        >
          {status === "submitting" ? t("form.submitting") : t("form.submit")}
        </Button>
      </form>
    </Form>
  );
}
