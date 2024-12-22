import { test, expect } from "@playwright/test";

test("check connections", async ({ page, baseURL }) => {
  console.log("Trying to connect to frontend...");
  const frontendResponse = await page.goto(baseURL!);
  console.log("Frontend status:", frontendResponse?.status());

  console.log("Trying to connect to backend...");
  const backendResponse = await page.goto("http://backend:80");
  console.log("Backend status:", backendResponse?.status());
});
