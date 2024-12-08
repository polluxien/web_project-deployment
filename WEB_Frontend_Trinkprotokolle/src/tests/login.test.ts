import { test, expect } from "@playwright/test";
import { Page } from "@playwright/test";
import dotenv from "dotenv";

// .env-Datei laden
dotenv.config();

// HILFSFUNKTIONEN
// Funktion zum Eingeben von Anmeldedaten
async function enterCredentials(page: Page, name: string, password: string) {
  //await page.getByTestId("login-button").click();
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "name" }).fill(name);
  await page.getByTestId("login-password").fill(password);
}

// Funktion zum Einreichen des Logins
async function submitLogin(page: Page) {
  await page.getByTestId("submit-button").click();
}

// Funktion zum Abbrechen des Logins
async function cancelLogin(page: Page) {
  await page.getByTestId("cancel-button").click();
}

// Funktion zur Überprüfung des Login-Status
async function isLoginSuccessful(page: Page) {
  return await page.getByTestId("logout-button").isVisible();
}

// Funktion zur Überprüfung der Fehlermeldung bei falschen Login-Daten
async function isLoginFailed(page: Page) {
  const errorMessage = await page.locator('[data-testid="login-error"]');
  return await errorMessage.isVisible();
}

// Funktion zum Abmelden
async function logout(page: Page) {
  await page.getByTestId("logout-button").click();
}

// EIGENTLICHE TESTING
test.describe("login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://localhost:3000");
  });

  test("login erfolgreich", async ({ page }) => {
    //in .env?
    await enterCredentials(
      page,
      process.env.PFLEGER_ADMIN_NAME_1!,
      process.env.PFLEGER_PASSWORD!
    );
    await submitLogin(page);

    // Überprüfe, ob der Login erfolgreich war
    await page.screenshot({
      path: "testsScreenshots/login/loginErfolgreich.png",
      fullPage: true,
    });
    expect(isLoginSuccessful(page)).toBeTruthy();
  });

  test("login mit falschen Daten", async ({ page }) => {
    await enterCredentials(page, "Lisa", "GGG_3245_HHH");
    await submitLogin(page);

    // Überprüfung ob nicht erfolgreich
    await page.screenshot({
      path: "testsScreenshots/login/falscheDaten.png",
      fullPage: true,
    });
    expect(isLoginFailed(page)).toBeTruthy();
  });

  test("login abrechen, nicht angemeldet", async ({ page }) => {
    await enterCredentials(page, "Lisa", "GGG_3245_HHH");
    await cancelLogin(page);

    // Überprüfung ob nicht erfolgreich
    const visable = await page
      .getByRole("button", { name: "Login" })
      .isVisible();
    await page.screenshot({
      path: "testsScreenshots/login/abbrechen.png",
      fullPage: true,
    });
    expect(visable).toBeTruthy();
  });

  test("loggout, nicht weiter angemeldet", async ({ page }) => {
    await enterCredentials(
      page,
      process.env.PFLEGER_ADMIN_NAME_1!,
      process.env.PFLEGER_PASSWORD!
    );
    await submitLogin(page);

    // Überprüfe, ob der Login erfolgreich war
    expect(isLoginSuccessful(page)).toBeTruthy();

    //Überprüft ob loggout erfolgreich
    await logout(page);
    const visable = await page
      .getByRole("button", { name: "Login" })
      .isVisible();
    await page.screenshot({
      path: "testsScreenshots/login/logout.png",
      fullPage: true,
    });
    expect(visable).toBeTruthy();
  });
});
