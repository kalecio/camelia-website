import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();
});

test("opens a named dialog and moves focus into it", async ({ page }) => {
  const dialog = page.getByRole("dialog", { name: "Menu de navegação" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect.poll(() => dialog.evaluate((element) => element === document.activeElement)).toBe(true);
});

test("traps forward and reverse tab navigation and inerts background content", async ({ page }) => {
  const dialog = page.getByRole("dialog", { name: "Menu de navegação" });
  const controls = dialog.locator('a[href], button:not([disabled])');
  const first = controls.first();
  const last = controls.last();

  await expect.poll(() => dialog.evaluate((element) => element === document.activeElement)).toBe(true);
  await page.keyboard.press("Shift+Tab");
  await expect.poll(() => last.evaluate((element) => element === document.activeElement)).toBe(true);
  await page.keyboard.press("Tab");
  await expect.poll(() => first.evaluate((element) => element === document.activeElement)).toBe(true);

  const backgrounds = await page.locator("body > *").evaluateAll((elements) =>
    elements.filter((element) => !element.contains(document.querySelector('[role="dialog"]')))
      .map((element) => (element as HTMLElement).inert),
  );
  expect(backgrounds.length).toBeGreaterThan(0);
  expect(backgrounds.every(Boolean)).toBe(true);
});

for (const closeMethod of ["Escape", "backdrop"] as const) {
  test(`closing with ${closeMethod} restores focus to the trigger`, async ({ page }) => {
    if (closeMethod === "Escape") {
      await page.keyboard.press("Escape");
    } else {
      await page.locator("[data-mobile-menu-portal] .fixed.inset-0.z-40").click({ position: { x: 2, y: 2 } });
    }
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect.poll(() => page.getByRole("button", { name: "Abrir menu" }).evaluate((element) => element === document.activeElement)).toBe(true);
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
}

test("menu controls expose a visible focus indicator", async ({ page }) => {
  const dialog = page.getByRole("dialog");
  const firstLink = dialog.getByRole("link").first();
  await expect.poll(() => dialog.evaluate((element) => element === document.activeElement)).toBe(true);
  await page.keyboard.press("Tab");
  await expect.poll(() => firstLink.evaluate((element) => element === document.activeElement)).toBe(true);
  const focusStyles = await firstLink.evaluate((element) => {
    const style = getComputedStyle(element);
    return { outline: style.outlineStyle, shadow: style.boxShadow };
  });
  expect(focusStyles.outline !== "none" || focusStyles.shadow !== "none").toBe(true);
});
