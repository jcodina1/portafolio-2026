import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home muestra hero, bifurcación dual y banda IA", async ({ page }) => {
  await page.goto("/es");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Juan Camilo Codina/i);
  await expect(page.getByText(/Para equipos que contratan/i)).toBeVisible();
  await expect(page.getByText(/Cómo trabajo con IA/i)).toBeVisible();
});

test("de la home al perfil en un clic", async ({ page }) => {
  await page.goto("/es");
  await page.getByRole("link", { name: /Ver mi perfil/i }).click();
  await expect(page).toHaveURL(/\/es\/perfil/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Juan Camilo/i);
});

test("perfil sin violaciones graves de accesibilidad", async ({ page }) => {
  await page.goto("/es/perfil");
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
});
