import { test, expect } from "@playwright/test";
import { AdminPage } from "./pageObject/AdminPage";
import dotenv from "dotenv";

dotenv.config();

test.describe("Admin Page Tests", () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await adminPage.navigateToLoginPage();
  });

  test("Admin Bereich sichtbar und betretbar", async ({ page }) => {
    await adminPage.login(
      process.env.PFLEGER_ADMIN_NAME_1!,
      process.env.PFLEGER_PASSWORD!
    );
    await adminPage.navigateToAdminPage();
    expect(await adminPage.isOnAdminPage()).toBeTruthy();
  });

  test("Nicht-Admin kann Admin Bereich nicht sehen", async ({ page }) => {
    await adminPage.login(
      process.env.PFLEGER_NAME_3!,
      process.env.PFLEGER_PASSWORD!
    );
    const adminLinkVisible = await page
      .getByRole("link", { name: "Admin" })
      .isVisible();
    expect(adminLinkVisible).toBeFalsy();
  });

  test("Pfleger erstellen ohne Passwort", async ({ page }) => {
    await adminPage.login(
      process.env.PFLEGER_ADMIN_NAME_1!,
      process.env.PFLEGER_PASSWORD!
    );
    await adminPage.navigateToAdminPage();
    await adminPage.createPfleger({
      name: "Lisabeth",
      geschlecht: "Männlich",
      geburtsdatum: "2024-10-05",
      adresse: "Kantstraße 6, Berlin 14059",
      position: "Aushilfe",
    });

    const errorVisible = await page
      .locator('[data-testid="error-message"]')
      .isVisible();
    expect(errorVisible).toBeTruthy();
  });

  test("Pfleger löschen", async () => {
    await adminPage.login(
      process.env.PFLEGER_ADMIN_NAME_1!,
      process.env.PFLEGER_PASSWORD!
    );
    await adminPage.navigateToAdminPage();
    await adminPage.deletePfleger("Lisa");
    expect(await adminPage.isPflegerVisible("Lisa")).toBeFalsy();
  });
});
