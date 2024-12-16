import { test, expect, Page } from "@playwright/test";
import dotenv from "dotenv";

// .env-Datei laden
dotenv.config();

// Funktion zur Überprüfung des Login-Status
async function isLoginSuccessful(page: Page) {
  const logoutButton = await page.locator('[data-testid="logout-button"]');
  return await logoutButton.isVisible();
}

test.describe("admin Page Sichtbarkeit", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://localhost:3000");
  });
  test("als Admin, Admin bereich Sichtbar und betretbar", async ({ page }) => {
    await page.getByTestId("login-button").click();
    await page
      .getByTestId("login-username")
      .fill(process.env.PFLEGER_ADMIN_NAME_1!);
    await page
      .getByTestId("login-password")
      .fill(process.env.PFLEGER_PASSWORD!);
    await page.getByTestId("submit-button").click();
    await page.getByRole("link", { name: "Admin" }).click();

    //prüfen ob man sich auf der Admin-seite befindet
    const currentUrl = page.url();
    expect(currentUrl).toBe("https://localhost:3000/admin");
  });

  test("als NICHT Admin, Admin bereich nicht Sichtbar und betretbar", async ({
    page,
  }) => {
    await page.getByTestId("login-button").click();
    await page.getByTestId("login-username").fill(process.env.PFLEGER_NAME_3!);
    await page
      .getByTestId("login-password")
      .fill(process.env.PFLEGER_PASSWORD!);
    await page.getByTestId("submit-button").click();

    //prüfen ob Admin Page sichtbar als nicht Admin
    const visability = await page
      .getByRole("link", { name: "Admin" })
      .isVisible();
    expect(visability).toBeFalsy();
  });
});

test.describe("Usermangement verwaltung", () => {
  test.beforeEach(async ({ page }) => {
    //einlog Prozess mit Admin User
    await page.goto("https://localhost:3000");
    await page.getByTestId("login-button").click();
    await page
      .getByTestId("login-username")
      .fill(process.env.PFLEGER_ADMIN_NAME_1!);
    await page
      .getByTestId("login-password")
      .fill(process.env.PFLEGER_PASSWORD!);
    await page.getByTestId("submit-button").click();
    await page.getByRole("link", { name: "Admin" }).click();
  });

  test("eingellogter User im Usermangment sichtbar mit allen Attributen", async ({
    page,
  }) => {
    await page
      .getByRole("button", {
        name: process.env.PFLEGER_ADMIN_NAME_1! + " Admin",
      })
      .click();

    //Sichtbarkeit der einzelenen Attribute vom Testuser
    expect(page.getByText("Geschlecht: Männlich").isVisible()).toBeTruthy();
    expect(
      await page.getByText("Geburtsdatum: 10.04.1975").isVisible()
    ).toBeTruthy();
    expect(
      await page.getByText("Adresse: Behrensenstraße 14,").isVisible()
    ).toBeTruthy();
    expect(
      await page.getByText("Position: Abteilungsleiter").isVisible()
    ).toBeTruthy();
  });

  test("Anlegen von neuen Pfleger ohne Passwort", async ({ page }) => {
    await page.getByRole("button", { name: "Neuen Pfleger" }).click();
    await page.getByPlaceholder("Max Mustermann").click();
    await page.getByPlaceholder("Max Mustermann").fill("Lisabeth");
    await page.getByLabel("Geschlecht").selectOption("Männlich");
    await page.getByLabel("Geburtsdatum").fill("2024-10-05");
    await page.getByLabel("Adresse").click();
    await page.getByLabel("Adresse").fill("Kantstraße 6, Berlin 14059");
    await page.getByLabel("Position").click();
    await page.getByLabel("Position").fill("Aushilfe");
    await page.getByLabel("Position").press("Tab");
    await page.getByRole("button", { name: "Speichern" }).click();

    //Fehlercode wird angezeigt
    let visable = await page
      .getByText("Bitte geben Sie ein gültiges Passwort ein (3-100 Zeichen)")
      .isVisible();
    expect(visable).toBeTruthy();
  });

  test("Erstellter Pfleger kann sich einloggen", async ({ page }) => {
    //Verstehe nicht wieso der Test nicht funktioniert wobei genau unter den Attributen, ein neuer Pfler erstellt und sichtbar ist
    await page.getByRole("button", { name: "Neuen Pfleger" }).click();
    await page.getByPlaceholder("Max Mustermann").click();
    await page.getByPlaceholder("Max Mustermann").fill("Lisabeth");
    await page.getByLabel("Geschlecht").selectOption("Männlich");
    await page.getByLabel("Geburtsdatum").fill("2024-10-05");
    await page.getByLabel("Adresse").click();
    await page.getByLabel("Adresse").fill("Kantstraße 6, Berlin 14059");
    await page.getByLabel("Position").click();
    await page.getByLabel("Position").fill("Aushilfe");
    await page.getByLabel("Position").press("Tab");
    await page.getByLabel("Passwort").fill(process.env.PFLEGER_PASSWORD!);
    await page.getByRole("button", { name: "Speichern" }).click();


    //ausloggen
    await page.getByTestId("logout-button").click();
    //einloggen
    await page.getByTestId("login-button").click();
    await page
      .getByTestId("login-username")
      .fill("Lisabeth");
    await page
      .getByTestId("login-password")
      .fill(process.env.PFLEGER_PASSWORD!);
    await page.getByTestId("submit-button").click();

    await page.screenshot({
      path: "testsScreenshots/admin/anlegenNeuerPfleger.png",
      fullPage: true,
    });

    //logout ist sichtbar
    const log = await page.getByTestId("logout-button").isVisible();
    expect(log).toBeTruthy()

  });

  test("Anlegen von neuen Pfleger abbrechen", async ({ page }) => {
    await page.getByRole("button", { name: "Neuen Pfleger" }).click();
    await page.getByPlaceholder("Max Mustermann").fill("Alina");

    //abbrechen
    await page.getByRole("button", { name: "Abbrechen" }).click();
    const visability = await page
      .getByRole("button", { name: "Alina" })
      .isVisible();
    expect(visability).toBeFalsy();
  });

  test("Löschen von anderen Pflegern", async ({ page }) => {
    await page.getByRole("button", { name: "Lisa Admin" }).click();
    await page.getByRole("button", { name: "Löschen" }).click();
    await page.getByRole("button", { name: "OK" }).click();

    //
    const visability = await page
      .getByRole("button", { name: "Lisa Admin" })
      .isVisible();
    expect(visability).toBeFalsy();
  });

  test("Löschen abbrechen immer noch da", async ({ page }) => {
    await page.getByRole("button", { name: "Micha Admin" }).click(); //
    await page.getByRole("button", { name: "Löschen" }).click();
    await page.getByRole("button", { name: "Abbrechen" }).click();

    //ist immer noch da
    const visability = await page
      .getByRole("button", { name: "Micha Admin" }) //
      .isVisible();
    expect(visability).toBeTruthy();
  });

  test("Bearbeiten von Pfleger", async ({ page }) => {
    await page.getByRole("button", { name: "Micha Admin" }).click();
    await page.getByRole("button", { name: "Editieren" }).click();
    await page.getByLabel("Geschlecht").selectOption("Divers");
    await page.getByLabel("Geburtsdatum").fill("1975-10-05");
    await page.getByLabel("Adresse").click();
    await page.getByLabel("Adresse").fill("Behrensenstraße 14, 14059 Köln");
    await page.getByLabel("Position").click();
    await page.getByLabel("Position").fill("Abteilungsleiter*in");
    await page.getByRole("button", { name: "Speichern" }).click();

    //Attribute überprüfen
    await page.getByRole("button", { name: "Micha Admin" }).click();

    const positionVisible = await page
      .getByText("Position: Abteilungsleiter*in")
      .isVisible();
    const geschlechtVisible = await page
      .getByText("Geschlecht: Divers")
      .isVisible();
    const geburtsdatumVisible = await page
      .getByText("Geburtsdatum: 05.10.1975")
      .isVisible();
    const adresseVisible = await page
      .getByText("Adresse: Behrensenstraße 14, 14059 Köln")
      .isVisible();

    expect(positionVisible).toBeTruthy();
    expect(geschlechtVisible).toBeTruthy();
    expect(geburtsdatumVisible).toBeTruthy();
    expect(adresseVisible).toBeTruthy();
  });
});

test.describe("eingeloggten Pfleger löschen", async () => {
  test("eingeloggten Pfleger löschen", async ({ page }) => {
    //einlog Prozess mit Admin User Lisa
    await page.goto("https://localhost:3000");
    await page.getByTestId("login-button").click();
    await page
      .getByTestId("login-username")
      .fill(process.env.PFLEGER_ADMIN_NAME_2!);
    await page
      .getByTestId("login-password")
      .fill(process.env.PFLEGER_PASSWORD!);
    await page.getByTestId("submit-button").click();
    await page.getByRole("link", { name: "Admin" }).click();

    //Hier vlt nicht den Pfleger nehmen den ich für alle Tests benutzte lol
    await page
      .getByRole("button", {
        name: process.env.PFLEGER_ADMIN_NAME_2! + " Admin",
      })
      .click();
    await page.getByRole("button", { name: "Löschen" }).click();
    await page.getByRole("button", { name: "OK" }).click();

    //prüfen ob auf Startseite und nicht mehr im Admin bereich
    await page.waitForNavigation({
      timeout: 30000,
      url: "https://localhost:3000/",
    });
    const currentUrl = page.url();
    expect(currentUrl).toBe("https://localhost:3000/");

    //prüfen ob login möglich
    await page.getByTestId("login-button").click();
    await page
      .getByTestId("login-username")
      .fill(process.env.PFLEGER_ADMIN_NAME_2!);
    await page
      .getByTestId("login-password")
      .fill(process.env.PFLEGER_PASSWORD!);
    await page.getByTestId("submit-button").click();
    const errorMessage = await page.locator('[data-testid="login-error"]');
    expect(await errorMessage.isVisible()).toBeTruthy();
  });
});
