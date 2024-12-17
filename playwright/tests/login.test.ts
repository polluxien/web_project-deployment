import test, { expect } from "playwright/test";
import { LoginPage } from "./pom/loginPage";
// HILFSFUNKTIONEN

const myTester = { name: "Tobi", password: "123_abc_ABC" };

let loginPage: LoginPage;

test.describe("login", () => {
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("login erfolgreich", async ({ page }) => {
    //in .env?
    await loginPage.enterCredentials(page, myTester.name, myTester.password);
    await loginPage.submitLogin(page);

    // Überprüfe, ob der Login erfolgreich war
    await page.screenshot({
      path: "testsScreenshots/login/loginErfolgreich.png",
      fullPage: true,
    });
    expect(loginPage.isLoginSuccessful(page)).toBeTruthy();
  });

  test("login mit falschen Daten", async ({ page }) => {
    await loginPage.enterCredentials(page, "Lisa", "GGG_3245_HHH");
    await loginPage.submitLogin(page);

    // Überprüfung ob nicht erfolgreich
    await page.screenshot({
      path: "testsScreenshots/login/falscheDaten.png",
      fullPage: true,
    });
    expect(loginPage.isLoginFailed(page)).toBeTruthy();
  });

  test("login abrechen, nicht angemeldet", async ({ page }) => {
    await loginPage.enterCredentials(page, "Lisa", "GGG_3245_HHH");
    await loginPage.cancelLogin(page);

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
    await loginPage.enterCredentials(page, myTester.name, myTester.password);
    await loginPage.submitLogin(page);

    // Überprüfe, ob der Login erfolgreich war
    expect(loginPage.isLoginSuccessful(page)).toBeTruthy();

    //Überprüft ob loggout erfolgreich
    await loginPage.logout(page);
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
