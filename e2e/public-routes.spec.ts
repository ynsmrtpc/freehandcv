import { expect, test } from "@playwright/test";

test.describe("missing public resources", () => {
  for (const path of [
    "/cv-sablonlari/e2e-missing", "/en/resume-templates/e2e-missing",
    "/cv-ornekleri/e2e-missing", "/en/resume-examples/e2e-missing",
    "/rehber/e2e-missing", "/en/guides/e2e-missing",
    "/kullanici/e2e-missing", "/en/users/e2e-missing",
  ]) {
    test(`${path} returns HTTP 404 with localized recovery`, async ({ page, request }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      // Recovery content must also work without JavaScript, rather than arriving only in RSC data.
      const html = await response!.text();
      expect(html).toContain("<h1");
      expect(html).toContain(`lang="${path.startsWith("/en/") ? "en" : "tr"}"`);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("html")).toHaveAttribute("lang", path.startsWith("/en/") ? "en" : "tr");
      const home = path.startsWith("/en/") ? "/en" : "/";
      await expect(page.locator(`main a[href="${home}"]`).first()).toBeVisible();
      expect((await request.head(path)).status()).toBe(404);
    });
  }
});

test("unknown routes use the same localized HTTP 404 document", async ({ request }) => {
  for (const path of ["/e2e-unknown-route", "/en/e2e-unknown-route"]) {
    const response = await request.get(path);
    expect(response.status()).toBe(404);
    expect(await response.text()).toContain("<h1");
  }
});

test("official templates and empty categories remain available", async ({ request }) => {
  for (const path of ["/cv-sablonlari/modern", "/en/resume-templates/modern", "/cv-ornekleri/saglik", "/en/resume-examples/healthcare"]) {
    expect((await request.get(path)).status()).toBe(200);
  }
});

test("private account data cannot be exported without a session", async ({ request }) => {
  expect((await request.get("/api/account/export")).status()).toBe(401);
});
