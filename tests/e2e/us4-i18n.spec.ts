import { test, expect } from "@playwright/test";

const switchBtn = /Cambiar idioma|Switch language/i;

test("cambia de idioma manteniendo la página (home)", async ({ page }) => {
  await page.goto("/es");
  await page.getByRole("button", { name: switchBtn }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByText(/For teams that hire/i)).toBeVisible();
});

test("rutas localizadas EN responden", async ({ page }) => {
  for (const path of ["/en", "/en/services", "/en/projects", "/en/profile", "/en/contact"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBeLessThan(400);
  }
});

test("el toggle mantiene la equivalencia en una sección (servicios -> services)", async ({ page }) => {
  await page.goto("/es/servicios");
  await page.getByRole("button", { name: switchBtn }).click();
  await expect(page).toHaveURL(/\/en\/services/);
});
