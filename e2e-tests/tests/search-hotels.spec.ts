import {test,expect} from "@playwright/test"
import { setTimeout } from "timers/promises";

const UI_URL="http://localhost:5173/";

test.beforeEach(async({page})=>{
      await page.goto(UI_URL);

      //get the sign in button
      await page.getByRole("link",{name:"Sign in"}).click();

      await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();

      await page.locator("[name=email]").fill("yashmeena1010@gmail.com");
      await page.locator("[name=password]").fill("10oct2002@Y");

      await page.getByRole("button",{name:"Login"}).click();

      setTimeout(async()=>{
      await expect(page.getByText("Sign in successful!")).toBeVisible();
      },5000)
      
});

test("should show hotel search results",async({page})=>{
      await page.goto(UI_URL);

      await page.getByPlaceholder("Where are you going?").fill("Jaipur");
      await page.getByRole("button",{name:"Search"}).click();

      await expect(page.getByText("Hotels found in jaipur")).toBeVisible();
     setTimeout(async()=>{
      await expect(page.getByText("Rambagh Palace")).toBeVisible();
     },5000);

});

test("should show hotel detail",async({page})=>{
      await page.goto(UI_URL);

      await page.getByPlaceholder("Where are you going?").fill("Dublin");
      await page.getByRole("button", { name: "Search" }).click();
    
      setTimeout(async()=>{
            await expect(page.getByText("Rambagh Palace")).toBeVisible();
           },5000);

           setTimeout(async()=>{
            await expect(page).toHaveURL(/detail/);
           },5000);
      
      
      setTimeout(async()=>{
            await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
           },5000);
})




