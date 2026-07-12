import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("el tema alterna a oscuro y persiste tras recargar", async ({ page }) => {
  await page.goto("/es");
  await page.getByRole("button", { name: /Cambiar tema|Toggle theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("sin violaciones graves de a11y en tema oscuro", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/es");
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
});
