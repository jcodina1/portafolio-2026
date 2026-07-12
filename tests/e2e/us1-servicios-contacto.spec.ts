import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// US1: ruta comercial (servicios + contacto). Requiere el server (playwright.config
// levanta `npm run start`) y navegadores instalados (`npx playwright install`).

test("servicios lista las familias y muestra el gancho de diagnóstico", async ({ page }) => {
  await page.goto("/es/servicios");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /Automatización e IA/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /No sabes por dónde empezar/i })).toBeVisible();
});

test("la página de familia muestra paquetes con qué recibes y resultado", async ({ page }) => {
  await page.goto("/es/servicios/automatizacion-ia");
  await expect(page.getByRole("heading", { name: "Automatiza 1" })).toBeVisible();
  await expect(page.getByText(/Qué recibes/i).first()).toBeVisible();
});

test("el formulario de contacto valida en cliente", async ({ page }) => {
  await page.goto("/es/contacto");
  await page.getByRole("button", { name: /Enviar mensaje/i }).click();
  await expect(page.getByText(/Ingresa tu nombre/i)).toBeVisible();
});

test("sin violaciones graves de accesibilidad en servicios", async ({ page }) => {
  await page.goto("/es/servicios");
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((v) =>
    ["serious", "critical"].includes(v.impact ?? ""),
  );
  expect(serious).toEqual([]);
});
