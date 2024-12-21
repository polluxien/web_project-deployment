// Funktion zum Eingeben von Anmeldedaten
import { Page } from "@playwright/test";

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async goto() {
    //Startseite mit baseURL
    await this.page.goto("/"); 
  }

  async enterCredentials(page: Page, name: string, password: string) {
    //await page.getByTestId("login-button").click();
    await page.getByTestId("login-button").click();
    await page.getByRole("textbox", { name: "name" }).fill(name);
    await page.getByTestId("login-password").fill(password);
  }

  // Funktion zum Einreichen des Logins
  async submitLogin(page: Page) {
    await page.getByTestId("submit-button").click();
  }

  // Funktion zum Abbrechen des Logins
  async cancelLogin(page: Page) {
    await page.getByTestId("cancel-button").click();
  }

  // Funktion zur Überprüfung des Login-Status
  async isLoginSuccessful(page: Page) {
    return await page.getByTestId("logout-button").isVisible();
  }

  // Funktion zur Überprüfung der Fehlermeldung bei falschen Login-Daten
  async isLoginFailed(page: Page) {
    const errorMessage = await page.locator('[data-testid="login-error"]');
    return await errorMessage.isVisible();
  }

  // Funktion zum Abmelden
  async logout(page: Page) {
    await page.getByTestId("logout-button").click();
  }
}
