import { expect, test } from "@playwright/test";

test("@closed shows the submission window as closed", async ({ page }) => {
  await page.goto("/enviar");
  await expect(page.getByRole("heading", { name: "As submissões estão encerradas" })).toBeVisible();
  await expect(page.locator("form")).toHaveCount(0);
});
