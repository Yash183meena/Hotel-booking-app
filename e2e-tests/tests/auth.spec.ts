import { test, expect } from '@playwright/test';

const UI_URL='http://localhost:5173/';

//IN side first parameter of test this only should  or should not is used
test('should allow the user to sign in', async ({ page }) => {

  //to to that page
   await page.goto(UI_URL);

   //get the sign in button(getByRole is used to extract eleemnt from page)
   await page.getByRole("link",{name:"Sign in"}).click();

   await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();

   //to locate the fields in that page
   await page.locator("[name=email]").fill("dd@gmail.com");
   await page.locator("[name=password]").fill("123456"); 

   await page.getByRole("button",{name:"Login"}).click();
   await expect(page.getByText("Sign in successful!")).toBeVisible();
   await expect(page.getByRole("link",{name:"My Bookings"})).toBeVisible();
   await expect(page.getByRole("link",{name:"My Hotels"})).toBeVisible();
   await expect(page.getByRole("button",{name:"Sign Out"})).toBeVisible();
});


