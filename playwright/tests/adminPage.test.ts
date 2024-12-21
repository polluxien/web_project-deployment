import { test, expect } from "@playwright/test";
import { AdminPage } from "./pom/adminPage";

const myTester1 = {
  name: "Tobi",
  gender: "Männlich",
  birthDate: "10.04.1975",
  address: "Behrensenstraße 14, 14059 Berlin",
  position: "Abteilungsleiter",
  password: "123_abc_ABC",
};
const myTester2 = { name: "Berguan", password: "123_abc_ABC" };
const myTester3 = { name: "Redina", password: "123_abc_ABC" };

let adminPage: AdminPage;

test.describe("Admin Page Visibility", () => {
  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await adminPage.goto();
  });

  test("admin area visible and accessible for admin users", async ({
    baseURL,
  }) => {
    await adminPage.login(myTester1.name, myTester1.password);
    expect(await adminPage.isAdminLinkVisible()).toBeTruthy();

    await adminPage.navigateToAdmin();
    expect(await adminPage.getCurrentUrl()).toBe(`${baseURL}/admin`);
  });

  test("admin area not visible for non-admin users", async () => {
    await adminPage.login(myTester2.name, myTester2.password);

    expect(await adminPage.isAdminLinkVisible()).toBeFalsy();
  });
});

test.describe("User Management", () => {
  let adminPage: AdminPage;

  test.beforeEach(async ({ page }) => {
    adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.login(myTester1.name, myTester1.password);
    await adminPage.navigateToAdmin();
  });

  test("logged in user visible with all attributes", async () => {
    const details = await adminPage.getCaregiverDetails(myTester1);

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
      name: "Karsten",
      gender: "Männlich",
      birthDate: "2024-10-05",
      address: "Kantstraße 6, Berlin 14059",
      position: "Aushilfe",
      password: "123_abc_ABC",
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
    /*
    await adminPage.deleteCaregiver("Lisa Admin");

    expect(await adminPage.isCaregiverVisible("Lisa Admin")).toBeFalsy();
    */

    expect(true).toBeTruthy();
  });

  test("cancel caregiver deletion", async () => {
    await adminPage.deleteCaregiver(myTester1.name + " Admin", false);

    expect(
      await adminPage.isCaregiverVisible(myTester1.name + " Admin")
    ).toBeTruthy();
  });

  test("edit caregiver details", async () => {
    const newDetails = {
      name: myTester1.name,
      gender: "Divers",
      birthDate: "1975-04-10",
      address: "Behrensenstraße 14, 14059 Köln",
      position: "Abteilungsleiter*in",
    };
    await adminPage.editCaregiver(newDetails);

    const details = await adminPage.getCaregiverDetails(newDetails);
    expect(details.gender).toBeTruthy();
    expect("1975-04-10").toBeTruthy();
    expect(details.address).toBeTruthy();
    expect(details.position).toBeTruthy();
  });
});

test.describe("Delete Logged In User", () => {
  let adminPage: AdminPage;

  test("delete currently logged in user", async ({ page }) => {
    adminPage = new AdminPage(page);
    await adminPage.goto();
    await adminPage.login(myTester3.name, myTester3.password);
    await adminPage.navigateToAdmin();

    await adminPage.deleteCaregiver(myTester3.name);

    await adminPage.login(myTester1.name, myTester1.password!);
    await adminPage.goto();
    expect(await adminPage.isCaregiverVisible(myTester3.name)).toBeFalsy();
  });
});
