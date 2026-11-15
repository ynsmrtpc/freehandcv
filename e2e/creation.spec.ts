import { expect, test } from "@playwright/test";

test("guest wizard produces the ordinary editable resume without an account", async ({
  page,
}) => {
  await page.goto("/en/resume-wizard");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByLabel("Full name", { exact: true })
    .fill("Synthetic Wizard User");
  await page.getByLabel("Target position", { exact: true }).fill("Engineer");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("radio", { name: "Plain", exact: true }).check();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByRole("radio", { name: "Plain", exact: true }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(
    page.getByText("Synthetic Wizard User", { exact: true }),
  ).toBeVisible();
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
  }
  await page
    .getByRole("button", { name: "Finish in the editor", exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/create-resume$/);
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("freehandcv:guest-resume:v1")!),
  );
  expect(saved.personal.name).toBe("Synthetic Wizard User");
  expect(saved.settings.template).toBe("minimal");
  expect(saved.settings.showPhoto).toBe(false);
});

test("LinkedIn CSV maps locally and waits for review before changing a CV", async ({
  page,
}) => {
  await page.goto("/en/resume-import");
  await expect(page.locator('input[type="file"]')).toBeEnabled();
  await page.locator('input[type="file"]').setInputFiles({
    name: "Profile.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(
      "First Name,Last Name,Headline\nSynthetic,Import User,Engineer",
    ),
  });
  await expect(
    page.getByText("CSV fields have been mapped. Review before saving.", {
      exact: true,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(() =>
      localStorage.getItem("freehandcv:guest-resume:v1"),
    ),
  ).toBeNull();
  await page
    .getByRole("button", { name: "Review the information", exact: true })
    .click();
  await expect(page.getByLabel("Full name", { exact: true })).toHaveValue(
    "Synthetic Import User",
  );
});

test("standalone ATS checks a FreehandCV file locally", async ({ page }) => {
  await page.goto("/en/ats-resume-check");
  await page.locator('input[type="file"]').setInputFiles({
    name: "resume.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        personal: {
          name: "Synthetic User",
          title: "Engineer",
          email: "synthetic@example.test",
          phone: "+90 500 000 00 00",
        },
      }),
    ),
  });
  await page
    .getByRole("button", { name: "Check the resume", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Check results", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Content and saved-template checks use your FreehandCV data.",
      { exact: true },
    ),
  ).toBeVisible();
});
