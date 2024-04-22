import { test, expect } from "@playwright/test";
import path from "path";

// In order for the flow to work, we first need to upload equipments,
// then vehicles, and then we can display and edit.
// To ensure this, we need to run tests in serial.
test.describe.configure({ mode: "serial" });

test("uploads equipment", async ({ page }) => {
  await page.goto("/admin");

  // try uploading invalid JSON
  await page
    .getByLabel("Upload equipment")
    .setInputFiles(path.join(__dirname, "vehicles.json"));
  await page.getByRole("button").nth(0).click();
  await expect(
    page.getByText("An error occured when trying to upload equipments")
  ).toBeVisible();

  // upload valid JSON
  await page
    .getByLabel("Upload equipment")
    .setInputFiles(path.join(__dirname, "equipments.json"));
  await page.getByRole("button").nth(0).click();
  await expect(
    page.getByText("Equipments uploaded successfully")
  ).toBeVisible();
});

test("uploads vehicles", async ({ page }) => {
  await page.goto("/admin");

  // try uploading invalid JSON
  await page
    .getByLabel("Upload vehicles")
    .setInputFiles(path.join(__dirname, "equipments.json"));
  await page.getByRole("button").nth(1).click();
  await expect(
    page.getByText("An error occured when trying to upload vehicles")
  ).toBeVisible();

  // upload valid JSON
  await page
    .getByLabel("Upload vehicles")
    .setInputFiles(path.join(__dirname, "vehicles.json"));
  await page.getByRole("button").nth(1).click();
  await expect(page.getByText("Vehicles uploaded successfully")).toBeVisible();
});

test("shows vehicles", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "My Vehicles" })
  ).toBeVisible();

  // First vehicle
  const first = page.locator("article").nth(0);

  await expect(
    first.getByRole("heading", { level: 2, name: "v1" })
  ).toBeVisible();
  await expect(first.getByText("AB23")).toBeVisible();
  await expect(first.getByText("SpongeBob SquarePants")).toBeVisible();
  await expect(first.getByText("True")).toBeVisible();
  await expect(first.getByText("LNG")).toBeVisible();
  await expect(first.getByText("Crane")).toBeVisible();
  await expect(first.getByText("Tachograph")).toBeVisible();

  // second vehicle
  const second = page.locator("article").nth(1);

  await expect(
    second.getByRole("heading", { level: 2, name: "v2" })
  ).toBeVisible();
  await expect(second.getByText("XXW123")).toBeVisible();
  await expect(second.getByText("Patrick Star")).toBeVisible();
  await expect(second.getByText("True")).toBeVisible();
  await expect(second.getByText("Diesel")).toBeVisible();
  await expect(second.getByText("Tachograph")).toBeVisible();
});

test("edit vehicle", async ({ page }) => {
  await page.goto("/");

  const first = page.locator("article").nth(0);

  // enter edit mode
  await first.getByRole("button", { name: "Edit" }).click();

  // assert and update checkbox
  const checkbox = first.getByLabel("Is active");
  await expect(checkbox).toBeChecked();
  await checkbox.setChecked(false);

  // assert and update driver
  const driver = first.getByLabel("Driver");
  await expect(driver).toHaveValue("SpongeBob SquarePants");
  await driver.clear();
  await driver.fill("Plankton");

  // assert and update fuel type
  const fuelType = first.getByLabel("Fuel type");
  await expect(fuelType).toHaveValue("LNG");
  await fuelType.clear();
  await fuelType.fill("Diesel");

  // save
  await first.getByRole("button", { name: "Save" }).click();

  // assert that updates are shown
  await expect(first.getByText("Plankton")).toBeVisible();
  await expect(first.getByText("Diesel")).toBeVisible();
  await expect(first.getByText("False")).toBeVisible();
});
