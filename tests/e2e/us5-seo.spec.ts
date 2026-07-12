import { test, expect } from "@playwright/test";

test("sitemap, robots y llms responden 200", async ({ request }) => {
  for (const path of ["/sitemap.xml", "/robots.txt", "/llms.txt"]) {
    const r = await request.get(path);
    expect(r.status(), path).toBe(200);
  }
});

test("la home expone canónica, hreflang y JSON-LD", async ({ page }) => {
  await page.goto("/es");
  const canonical = await page.locator('link[rel="canonical"]').first().getAttribute("href");
  expect(canonical).toContain("/es");
  expect(await page.locator('link[rel="alternate"][hreflang="en"]').count()).toBeGreaterThan(0);
  expect(await page.locator('link[rel="alternate"][hreflang="x-default"]').count()).toBeGreaterThan(0);
  expect(await page.locator('script[type="application/ld+json"]').count()).toBeGreaterThan(0);
});

test("la familia de servicio expone JSON-LD Service y FAQPage", async ({ page }) => {
  await page.goto("/es/servicios/automatizacion-ia");
  const html = await page.content();
  expect(html).toContain('"@type":"Service"');
  expect(html).toContain('"@type":"FAQPage"');
});
