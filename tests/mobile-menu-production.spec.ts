import { expect, test } from "@playwright/test";

test("the production mobile dialog stays operable outside the inert background", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();

  const dialog = page.locator('[data-mobile-menu-portal] [role="dialog"]');
  await expect(dialog).toBeVisible();
  const hasInertAncestor = await dialog.evaluate((element) => {
    for (let ancestor: HTMLElement | null = element as HTMLElement; ancestor; ancestor = ancestor.parentElement) {
      if (ancestor.inert) return true;
    }
    return false;
  });
  expect(hasInertAncestor).toBe(false);

  await dialog.getByRole("button", { name: "Fechar menu" }).click();
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.getByRole("button", { name: "Abrir menu" }).evaluate((element) => element === document.activeElement)).toBe(true);
});
