import { test, expect } from "@playwright/test";
import { AdminPage } from "./AdminPage";

test.describe("Admin Page Visibility", () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await adminPage.goto();
  });

  test("admin area visible and accessible for admin users", async () => {
    await adminPage.login(
      process.env.PFLEGER_ADMIN_NAME_1!,
      process.env.PFLEGER_PASSWORD!
    );
    await adminPage.navigateToAdmin();

    expect(await adminPage.getCurrentUrl()).toBe(
      "https://localhost:3000/admin"
    );
  });

  test("admin area not visible for non-admin users", async () => {
    await adminPage.login(
      process.env.PFLEGER_NAME_3!,
      process.env.PFLEGER_PASSWORD!
    );

    expect(await adminPage.isAdminLinkVisible()).toBeFalsy();
  });
});

test.describe("User Management", () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.login(
      process.env.PFLEGER_ADMIN_NAME_1!,
      process.env.PFLEGER_PASSWORD!
    );
    await adminPage.navigateToAdmin();
  });

  test("logged in user visible with all attributes", async () => {
    const details = await adminPage.getCaregiverDetails(
      process.env.PFLEGER_ADMIN_NAME_1! + " Admin"
    );

    expect(details.gender).toBeTruthy();
    expect(details.birthDate).toBeTruthy();
    expect(details.address).toBeTruthy();
    expect(details.position).toBeTruthy();
  });

  test("creating new caregiver without password shows error", async () => {
    await adminPage.createNewCaregiver({
      name: "Lisabeth",
      gender: "Männlich",
      birthDate: "2024-10-05",
      address: "Kantstraße 6, Berlin 14059",
      position: "Aushilfe",
    });

    expect(await adminPage.isPasswordErrorVisible()).toBeTruthy();
  });

  test("created caregiver can login", async () => {
    const newCaregiver = {
      name: "Lisabeth",
      gender: "Männlich",
      birthDate: "2024-10-05",
      address: "Kantstraße 6, Berlin 14059",
      position: "Aushilfe",
      password: process.env.PFLEGER_PASSWORD!,
    };

    await adminPage.createNewCaregiver(newCaregiver);
    await adminPage.logout();
    await adminPage.login(newCaregiver.name, newCaregiver.password);

    expect(await adminPage.isLogoutButtonVisible()).toBeTruthy();
  });

  test("cancel creating new caregiver", async () => {
    await adminPage.createNewCaregiver({
      name: "Alina",
      gender: "Männlich",
      birthDate: "2024-10-05",
      address: "Test Address",
      position: "Test Position",
    });

    expect(await adminPage.isCaregiverVisible("Alina")).toBeFalsy();
  });

  test("delete other caregivers", async () => {
    await adminPage.deleteCaregiver("Lisa Admin");

    expect(await adminPage.isCaregiverVisible("Lisa Admin")).toBeFalsy();
  });

  test("cancel caregiver deletion", async () => {
    await adminPage.deleteCaregiver("Micha Admin", false);

    expect(await adminPage.isCaregiverVisible("Micha Admin")).toBeTruthy();
  });

  test("edit caregiver details", async () => {
    await adminPage.editCaregiver("Micha Admin", {
      gender: "Divers",
      birthDate: "1975-10-05",
      address: "Behrensenstraße 14, 14059 Köln",
      position: "Abteilungsleiter*in",
    });

    const details = await adminPage.getCaregiverDetails("Micha Admin");
    expect(details.gender).toBeTruthy();
    expect(details.birthDate).toBeTruthy();
    expect(details.address).toBeTruthy();
    expect(details.position).toBeTruthy();
  });
});

test.describe("Delete Logged In User", () => {
  let adminPage: AdminPage;

  test("delete currently logged in user", async ({ page }) => {
    adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.login(
      process.env.PFLEGER_ADMIN_NAME_2!,
      process.env.PFLEGER_PASSWORD!
    );
    await adminPage.navigateToAdmin();

    await adminPage.deleteCaregiver(
      process.env.PFLEGER_ADMIN_NAME_2! + " Admin"
    );

    expect(await adminPage.getCurrentUrl()).toBe("https://localhost:3000/");

    await adminPage.login(
      process.env.PFLEGER_ADMIN_NAME_2!,
      process.env.PFLEGER_PASSWORD!
    );
    expect(await adminPage.isLoginErrorVisible()).toBeTruthy();
  });
});
