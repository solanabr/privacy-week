import { expect, test } from "@playwright/test";
import type { Browser, Locator, Page } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const screenshots = resolve("artifacts/screenshots");

async function hideStaleE2ESubmissions(browser: Browser, baseURL: string | undefined) {
  const username = process.env.PW_ADMIN_USERNAME;
  const password = process.env.PW_ADMIN_PASSWORD;
  if (!baseURL || !username || !password) {
    throw new Error("Admin test credentials and base URL are required for E2E cleanup.");
  }

  const context = await browser.newContext({
    baseURL,
    httpCredentials: { username, password },
  });
  const page = await context.newPage();
  await page.goto("/admin");
  const hrefs = await page.locator("tbody tr").evaluateAll((rows) =>
    rows.flatMap((row) => {
      if (!row.textContent?.includes("Exemplo E2E")) return [];
      const href = row.querySelector<HTMLAnchorElement>('a[href^="/admin/"]')?.getAttribute("href");
      return href ? [href] : [];
    }),
  );

  for (const href of hrefs) {
    await page.goto(href);
    const status = page.locator('select[name="status"]');
    if ((await status.inputValue()) === "submitted") {
      await status.selectOption("hidden");
      await saveAdminAction(page, page.getByRole("button", { name: "Salvar moderação" }));
      await expect(status).toHaveValue("hidden");
    }

    const winner = page.locator('select[name="is_winner"]');
    const pool = page.locator('select[name="prize_pool"]');
    if ((await winner.inputValue()) !== "false" || (await pool.inputValue()) !== "") {
      await winner.selectOption("false");
      await pool.selectOption("");
      await saveAdminAction(page, page.locator("form").filter({ has: winner }).getByRole("button", { name: "Salvar", exact: true }));
      await page.reload();
      await expect(winner).toHaveValue("false");
    }
  }

  await context.close();
}

async function saveScreenshot(page: Page, name: string) {
  mkdirSync(screenshots, { recursive: true });
  // Keep Next's local development status portal out of handoff screenshots.
  await page.addStyleTag({ content: "nextjs-portal { display: none !important; }" });
  await page.evaluate(() => document.fonts.ready.then(() => true));
  await page.screenshot({ path: resolve(screenshots, name), fullPage: true });
}

async function saveAdminAction(page: Page, button: Locator) {
  const response = page.waitForResponse((candidate) =>
    candidate.request().method() === "POST" && new URL(candidate.url()).pathname.startsWith("/admin/"),
  );
  await button.click();
  await response;
}

test("@open submission, public gallery, admin review and CSV export", async ({ page, browser, baseURL }) => {
  await hideStaleE2ESubmissions(browser, baseURL);

  const projectName = `Exemplo E2E ${Date.now().toString(36)}`;
  const contactEmail = `e2e-${Date.now()}@example.com`;

  await page.goto("/");
  await saveScreenshot(page, "landing-desktop.png");
  const mobile = await browser.newPage({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });
  await mobile.goto("/");
  await saveScreenshot(mobile, "landing-mobile.png");
  const mobileWidths = await mobile.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
    offenders: [...document.querySelectorAll<HTMLElement>("body *")]
      .map((element) => ({
        tag: element.tagName,
        id: element.id,
        className: typeof element.className === "string" ? element.className : "",
        width: Math.round(element.getBoundingClientRect().width),
        right: Math.round(element.getBoundingClientRect().right),
        text: (element.textContent ?? "").slice(0, 70),
      }))
      .filter((element) => element.right > document.documentElement.clientWidth + 2)
      .slice(0, 12),
  }));
  expect(mobileWidths.content, JSON.stringify(mobileWidths.offenders)).toBeLessThanOrEqual(mobileWidths.viewport);
  await mobile.close();

  await page.goto("/enviar");
  await saveScreenshot(page, "submission-form.png");
  const submitButton = page.getByRole("button", { name: "Enviar projeto" });
  await expect(submitButton).toBeDisabled();
  await expect(page.getByRole("link", { name: "Conectar com X" })).toBeVisible();

  await page.goto("/auth/x/callback?code=forged&state=forged");
  await expect(page).toHaveURL(/x_error=invalid_state/);
  await expect(submitButton).toBeDisabled();

  await page.getByRole("link", { name: "Conectar com X" }).click();
  await expect(page).toHaveURL(/x_connected=1/);
  await expect(page.getByText("Conta conectada: @e2e_builder")).toBeVisible();
  await expect(submitButton).toBeEnabled();
  await saveScreenshot(page, "submission-form-connected.png");

  await page.getByLabel("Nome do projeto").fill(projectName);
  await page.getByLabel("Nome do time").fill("Time E2E");
  await page.getByLabel("Em uma frase, o que o projeto faz").fill("Um produto de teste com privacidade.");
  await page.locator("select[name=category]").selectOption("cloak");
  await page.locator("select[name=tech]").selectOption("cloak");
  await page.getByLabel("Repositório no GitHub").fill("https://github.com/exemplo/privacy-week-e2e");
  await page.getByLabel("O que foi feito no sprint").fill("Integração de teste para verificar o fluxo completo.");
  await page.getByLabel("Prova de que funciona").fill("1".repeat(88));
  await page.getByLabel("Vídeo de demo (até 2 min)").fill("https://www.youtube.com/watch?v=privacyweektest");
  await page.getByLabel("Texto de privacidade (até 300 palavras)").fill("O valor e o vínculo entre remetente e destinatário ficam escondidos de quem observa a chain. Isso protege a privacidade dos pagamentos.");
  await page.locator('input[name="members[0].name"]').fill("Integrante E2E");
  await page.getByLabel("Nome de contato").fill("Contato E2E");
  await page.getByLabel("E-mail de contato").fill(contactEmail);
  await page.getByLabel("Li e aceito as regras do Privacy Sprint e do Hackathon da Colosseum").check();
  await page.locator("form button[type=submit]").click();

  await expect(page.getByRole("heading", { name: "Projeto enviado" })).toBeVisible();
  const successText = await page.locator("main").innerText();
  expect(successText).toMatch(/Nº 0\d{3}/);
  const editUrl = successText.match(/https?:\/\/[^\s]+\/editar\/[A-Za-z0-9_-]+/)?.[0];
  expect(editUrl).toBeTruthy();

  await page.goto(editUrl!);
  await expect(page.getByRole("heading", { name: "Editar projeto" })).toBeVisible();
  await page.getByLabel("Em uma frase, o que o projeto faz").fill("Versão atualizada do produto de teste.");
  await page.locator("form button[type=submit]").click();
  await expect(page.getByText("Alterações salvas.")).toBeVisible();

  await page.goto("/projetos");
  await expect(page.getByText(projectName)).toBeVisible();
  expect(await page.content()).not.toContain(contactEmail);
  expect(await page.content()).not.toContain("e2e_builder");
  expect(await page.content()).not.toContain("900000000000000001");
  await saveScreenshot(page, "projects-gallery.png");
  await page.getByRole("link", { name: "Ver projeto" }).first().click();
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
  expect(await page.content()).not.toContain(contactEmail);
  expect(await page.content()).not.toContain("e2e_builder");
  expect(await page.content()).not.toContain("900000000000000001");
  await saveScreenshot(page, "project-detail.png");

  const username = process.env.PW_ADMIN_USERNAME;
  const password = process.env.PW_ADMIN_PASSWORD;
  if (!username || !password) throw new Error("Admin test credentials were not loaded from .env.local.");
  const adminContext = await browser.newContext({ httpCredentials: { username, password } });
  const adminPage = await adminContext.newPage();
  await adminPage.goto("/admin");
  await expect(adminPage.getByRole("heading", { name: "Submissões" })).toBeVisible();
  await expect(adminPage.getByText(projectName)).toBeVisible();
  await saveScreenshot(adminPage, "admin-list.png");
  await adminPage.getByRole("link", { name: projectName }).click();
  await expect(adminPage.getByText(contactEmail)).toBeVisible();
  await expect(adminPage.getByText(/@e2e_builder/)).toBeVisible();
  await expect(adminPage.getByText("900000000000000001")).toBeVisible();
  await saveScreenshot(adminPage, "admin-detail.png");

  await adminPage.locator('select[name="status"]').selectOption("hidden");
  await saveAdminAction(adminPage, adminPage.getByRole("button", { name: "Salvar moderação" }));
  await adminPage.reload();
  await expect(adminPage.locator('select[name="status"]')).toHaveValue("hidden");
  await page.goto("/projetos");
  await expect(page.getByText(projectName)).toHaveCount(0);

  await adminPage.locator('select[name="is_winner"]').selectOption("true");
  await adminPage.locator('select[name="prize_pool"]').selectOption("cloak");
  await saveAdminAction(adminPage, adminPage.locator("form").filter({ has: adminPage.locator('select[name="is_winner"]') }).getByRole("button", { name: "Salvar", exact: true }));
  await adminPage.reload();
  await expect(adminPage.locator('select[name="is_winner"]')).toHaveValue("true");

  await adminPage.locator('select[name="is_winner"]').selectOption("false");
  await adminPage.locator('select[name="prize_pool"]').selectOption("");
  await saveAdminAction(adminPage, adminPage.locator("form").filter({ has: adminPage.locator('select[name="is_winner"]') }).getByRole("button", { name: "Salvar", exact: true }));
  await adminPage.reload();
  await expect(adminPage.locator('select[name="is_winner"]')).toHaveValue("false");

  const auth = Buffer.from(`${username}:${password}`).toString("base64");
  const csvResponse = await adminContext.request.get(`${baseURL}/admin/export`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  expect(csvResponse.status()).toBe(200);
  const csv = await csvResponse.text();
  expect(csv).toContain(contactEmail);
  expect(csv).toContain("e2e_builder");
  expect(csv).not.toContain("edit_token_hash");
  expect(csv).not.toContain("ip_hash");
  await adminPage.goto("/admin?status=submitted");
  await saveScreenshot(adminPage, "admin-list.png");
  await adminContext.close();
});
