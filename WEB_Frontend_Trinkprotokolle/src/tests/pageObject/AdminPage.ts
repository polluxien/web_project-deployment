import { Page } from "@playwright/test";

export class AdminPage {
  constructor(private page: Page) {}

  async navigateToLoginPage() {
    await this.page.goto(process.env.BASE_URL || "http://localhost:3000");
    await this.page.getByTestId("login-button").click();
  }

  async login(username: string, password: string) {
    await this.page.getByTestId("login-username").fill(username);
    await this.page.getByTestId("login-password").fill(password);
    await this.page.getByTestId("submit-button").click();
  }

  async isLoggedIn() {
    const logoutButton = this.page.getByTestId("logout-button");
    return await logoutButton.isVisible();
  }

  async navigateToAdminPage() {
    await this.page.getByRole("link", { name: "Admin" }).click();
  }

  async isOnAdminPage() {
    return (
      this.page.url() === process.env.BASE_URL + "/admin" ||
      "http://localhost:3000/admin"
    );
  }

  async createPfleger(data: {
    name: string;
    geschlecht: string;
    geburtsdatum: string;
    adresse: string;
    position: string;
    password?: string;
  }) {
    await this.page.getByRole("button", { name: "Neuen Pfleger" }).click();
    await this.page.getByPlaceholder("Max Mustermann").fill(data.name);
    await this.page.getByLabel("Geschlecht").selectOption(data.geschlecht);
    await this.page.getByLabel("Geburtsdatum").fill(data.geburtsdatum);
    await this.page.getByLabel("Adresse").fill(data.adresse);
    await this.page.getByLabel("Position").fill(data.position);
    if (data.password) {
      await this.page.getByLabel("Passwort").fill(data.password);
    }
    await this.page.getByRole("button", { name: "Speichern" }).click();
  }

  async deletePfleger(name: string) {
    await this.page.getByRole("button", { name: `${name} Admin` }).click();
    await this.page.getByRole("button", { name: "Löschen" }).click();
    await this.page.getByRole("button", { name: "OK" }).click();
  }

  async isPflegerVisible(name: string) {
    return this.page.getByRole("button", { name: `${name} Admin` }).isVisible();
  }

  async editPfleger(
    name: string,
    updates: Partial<{
      geschlecht: string;
      geburtsdatum: string;
      adresse: string;
      position: string;
    }>
  ) {
    await this.page.getByRole("button", { name: `${name} Admin` }).click();
    await this.page.getByRole("button", { name: "Editieren" }).click();
    if (updates.geschlecht) {
      await this.page.getByLabel("Geschlecht").selectOption(updates.geschlecht);
    }
    if (updates.geburtsdatum) {
      await this.page.getByLabel("Geburtsdatum").fill(updates.geburtsdatum);
    }
    if (updates.adresse) {
      await this.page.getByLabel("Adresse").fill(updates.adresse);
    }
    if (updates.position) {
      await this.page.getByLabel("Position").fill(updates.position);
    }
    await this.page.getByRole("button", { name: "Speichern" }).click();
  }
}
