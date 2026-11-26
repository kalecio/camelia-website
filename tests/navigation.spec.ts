import { expect, test, type Page } from "@playwright/test";

async function openNavigation(page: Page, isMobile: boolean) {
  if (isMobile) {
    await page.getByRole("button", { name: "Abrir menu" }).click();
    return page.getByRole("dialog");
  }
  return page.getByRole("navigation", { name: "Primária" });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("every internal hash resolves to one rendered section", async ({ page, isMobile }) => {
  await openNavigation(page, isMobile);
  const hashes = await page.locator('a[href^="#"]').evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")!),
  );
  expect(hashes.length).toBeGreaterThan(0);
  for (const hash of hashes) {
    expect(hash).not.toBe("#");
    const target = page.locator(`section[id="${hash.slice(1)}"]`);
    await expect(target).toHaveCount(1);
    await expect(target).toBeVisible();
  }
});

test("header links reach product information and FAQ", async ({ page, isMobile }) => {
  for (const { name, hash, heading } of [
    { name: "Sobre o Produto", hash: "#about", heading: "Como Criamos Nossos Sabonetes" },
    { name: "Perguntas Frequentes", hash: "#faq", heading: "Perguntas frequentes" },
  ]) {
    const navigation = await openNavigation(page, isMobile);
    const role = isMobile ? "link" : "menuitem";
    await expect(navigation.getByRole(role, { name: "Depoimentos" })).toHaveCount(0);
    await navigation.getByRole(role, { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeInViewport({ ratio: 1 });
    const headingTop = await page.getByRole("heading", { name: heading, exact: true }).evaluate(
      (element) => element.getBoundingClientRect().top,
    );
    expect(headingTop).toBeGreaterThanOrEqual(64);
    if (isMobile) {
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    }
  }
});

test("Saiba mais reaches the existing product benefits", async ({ page }) => {
  await page.getByRole("link", { name: "Saiba mais", exact: true }).click();
  await expect(page).toHaveURL(/#benefits$/);
  await expect(page.getByRole("heading", { name: "Por Que Escolher Nossos Sabonetes?" })).toBeInViewport({ ratio: 1 });
  for (const name of ["100% Natural", "Embalagem Ecológica", "Livre de Crueldade", "Artesanal"]) {
    await expect(page.locator("#benefits").getByRole("heading", { name, exact: true })).toBeVisible();
  }
});

test("all contact actions reach the same catalog destination", async ({ page, isMobile }) => {
  const catalog = page.locator("main").getByRole("link", { name: "Catálogo", exact: true });
  const destination = await catalog.getAttribute("href");
  expect(destination).toBe("https://wa.me/5581985626046");
  await expect(page.getByRole("link", { name: "Contato", exact: true })).toHaveAttribute("href", destination!);

  const navigation = await openNavigation(page, isMobile);
  const action = isMobile
    ? navigation.getByRole("link", { name: "Catálogo", exact: true })
    : catalog;
  await expect(action).toHaveAttribute("href", destination!);
  // Exercise the click without contacting WhatsApp or launching an external app.
  await page.route(destination!, (route) => route.fulfill({ contentType: "text/html", body: "<h1>Catálogo</h1>" }));
  await action.click();
  await expect(page).toHaveURL(destination!);
});

test("footer Início returns to the hero section", async ({ page }) => {
  await page.getByRole("link", { name: "Início", exact: true }).click();
  await expect(page).toHaveURL(/#inicio$/);
  await expect(page.locator("#inicio")).toBeInViewport();
});
