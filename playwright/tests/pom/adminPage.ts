import { Page } from "@playwright/test";

export class AdminPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async goto() {
    await this.page.goto("/");
  }

  async navigateToAdmin() {
    await this.page.getByRole("link", { name: "Admin" }).click();
  }

  // Login related actions
  async login(username: string, password: string) {
    await this.page.getByTestId("login-button").click();
    await this.page.getByRole("textbox", { name: "name" }).fill(username);
    await this.page.getByTestId("login-password").fill(password);
    await this.page.getByTestId("submit-button").click();

    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector('[data-testid="logout-button"]', {
      state: "visible",
      timeout: 5000,
    });
  }

  async logout() {
    await this.page.getByTestId("logout-button").click();
  }

  // User management actions
  async createNewCaregiver({
    name,
    gender,
    birthDate,
    address,
    position,
    password,
  }: {
    name: string;
    gender: string;
    birthDate: string;
    address: string;
    position: string;
    password?: string;
  }) {
    await this.page.getByRole("button", { name: "Neuen Pfleger" }).click();
    await this.page.getByPlaceholder("Max Mustermann").fill(name);
    await this.page.getByLabel("Geschlecht").selectOption(gender);
    await this.page.getByLabel("Geburtsdatum").fill(birthDate);
    await this.page.getByLabel("Adresse").fill(address);
    await this.page.getByLabel("Position").fill(position);

    if (password) {
      await this.page.getByLabel("Passwort").fill(password);
    }

    await this.page.getByRole("button", { name: "Speichern" }).click();
  }

  async editCaregiver(
    {
      name,
      gender,
      birthDate,
      address,
      position,
    }: {
      name: string,
      gender: string;
      birthDate: string;
      address: string;
      position: string;
    }
  ) {
    await this.page.getByRole("button", { name }).click();
    await this.page.getByRole("button", { name: "Editieren" }).click();
    await this.page.locator('#gender').first().selectOption(gender);
    await this.page.getByLabel("Geburtsdatum").fill(birthDate);
    await this.page.getByLabel("Adresse").fill(address);
    await this.page.getByLabel("Position").fill(position);
    await this.page.getByRole("button", { name: "Speichern" }).click();
  }

  async deleteCaregiver(name: string, confirm: boolean = true) {
    await this.page.getByRole("button", { name }).click();
    await this.page.getByRole("button", { name: "Löschen" }).click();
    await this.page
      .getByRole("button", { name: confirm ? "OK" : "Abbrechen" })
      .click();
  }

  // Verification methods
  async isAdminLinkVisible() {
    return await this.page.getByRole("link", { name: "Admin" }).isVisible();
  }

  async isLogoutButtonVisible() {
    return await this.page.getByTestId("logout-button").isVisible();
  }

  async isCaregiverVisible(name: string) {
    return await this.page.getByRole("button", { name }).isVisible();
  }

  async getCurrentUrl() {
    return this.page.url();
  }

  async getCaregiverDetails({
    name,
    gender,
    birthDate,
    address,
    position,
    password,
  }: {
    name: string;
    gender: string;
    birthDate: string;
    address: string;
    position: string;
    password?: string;
  }) {
    await this.page.getByRole("button", { name: `${name} Admin` }).click();
    return {
      gender: await this.page
        .getByText("Geschlecht: " + gender)
        .first()
        .isVisible(),
      birthDate: await this.page
        .getByText("Geburtsdatum: " + birthDate)
        .first()
        .isVisible(),
      address: await this.page
        .getByText("Adresse: " + address)
        .first()
        .isVisible(),
      position: await this.page
        .getByText("Position: " + position)
        .first()
        .isVisible(),
    };
  }

  async isPasswordErrorVisible() {
    return await this.page
      .getByText("Bitte geben Sie ein gültiges Passwort ein (3-100 Zeichen)")
      .isVisible();
  }

  async isLoginErrorVisible() {
    return await this.page.locator('[data-testid="login-error"]').isVisible();
  }
}
