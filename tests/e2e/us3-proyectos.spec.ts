import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("proyectos lista los casos", async ({ page }) => {
  await page.goto("/es/proyectos");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Proyectos/i);
  await expect(page.getByRole("heading", { name: /Plataforma de gestión comercial/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Este portafolio/i })).toBeVisible();
});

test("el detalle muestra reto, solución y resultado", async ({ page }) => {
  await page.goto("/es/proyectos/windmar-plataforma");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Plataforma de gestión/i);
  await expect(page.getByText(/El reto/i)).toBeVisible();
  await expect(page.getByText(/El resultado/i)).toBeVisible();
});

test("proyectos sin violaciones graves de a11y", async ({ page }) => {
  await page.goto("/es/proyectos");
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
});
