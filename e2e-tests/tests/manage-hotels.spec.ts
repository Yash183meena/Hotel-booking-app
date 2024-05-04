import {test ,expect } from "@playwright/test";
import path from 'path';

const UI_URL="http://localhost:5173/";

test.beforeEach(async({page})=>{
      await page.goto(UI_URL);

      //get the sign in button
      await page.getByRole("link",{name:"Sign in"}).click();

      await expect(page.getByRole("heading",{name:"Sign In"})).toBeVisible();

      await page.locator("[name=email]").fill("yashmeena1010@gmail.com");
      await page.locator("[name=password]").fill("10oct2002@Y");

      await page.getByRole("button",{name:"Login"}).click();

      await expect(page.getByText("Sign in successful!")).toBeVisible();
      
});

test("should allow user to add a hotel",async({page})=>{
      await page.goto(`${UI_URL}add-hotel`)

      //to locate the input in the field
      await page.locator('[name="name"]').fill("Test Hotel");
      await page.locator('[name="city"]').fill("Test city");
      await page.locator('[name="country"]').fill("Test country");
      await page.locator('[name="description"]').fill("This is a description for the Test Hotel");
      await page.locator('[name="pricePerNight"]').fill("100");
      await page.selectOption('select[name="starRating"]', "3");

      await page.getByText("Budget").click();

      await page.getByLabel("Free Wifi").check();
      await page.getByLabel("Parking").check();

      await page.locator('[name="adultCount"]').fill("2");
      await page.locator('[name="childCount"]').fill("4");

      await page.setInputFiles('[name="imageFiles"]',[
            path.join(__dirname,"files","img1.jpg"),
            path.join(__dirname,"files","img2.jpg")
      ]);

      await page.getByRole("button",{name:"Save"}).click();
      setTimeout(async()=>{
            await expect(page.getByText("Hotel Saved!")).toBeVisible();
      },5000);

});

test("should display hotels",async({page})=>{
      await page.goto(`${UI_URL}my-hotels`);

      await expect(page.getByRole("heading",{name:"Out House Pushkar"})).toBeVisible();
      await expect(page.getByText("Set in Pushkar, 1.7 km from Pushkar ")).toBeVisible();
      await expect(page.getByText("pushkar,Ajmer,india")).toBeVisible();
      await expect(page.getByText("Ski Resort")).toBeVisible();   
      await expect(page.getByText("12000 per night")).toBeVisible();  
      await expect(page.getByText("8 adults, 4 children")).toBeVisible(); 
      await expect(page.getByText("3 Star Rating")).toBeVisible();
      await expect(page.getByRole("link",{name:"View Details"}).first()).toBeVisible();
      await expect(page.getByRole("link",{name:"Add Hotel"})).toBeVisible();

})

test("should edit hotel",async({page})=>{
      await page.goto(`${UI_URL}my-hotels`);

      //first() matlab returns locator to the first matching element matlab jaha par bhi first time "View Details" link milega usko hi chalayega
      await page.getByRole("link", {name :"View Details"}).first().click();
      
      await page.waitForSelector('[name="name"]', { state: "attached" });
      await expect(page.locator('[name="name"]')).toHaveValue("Out House Pushkar")
      await page.locator('[name="name"]').fill("Out House Pushkar Updated");
      await page.getByRole("button",{name:"Save"}).click();
      await expect(page.getByText("Hotel updated successfully!")).toBeVisible();

      //to refrsh the page and reload the data
      await page.reload();

      await expect(page.locator('[name="name"]')).toHaveValue("Out House Pushkar Updated");
      await page.locator('[name="name"]').fill("Out House Pushkar");
      await page.getByRole("button",{name:"Save"}).click();

})

// test("should edit hotel", async ({ page }) => {
//       await page.goto(`${UI_URL}my-hotels`);
    
//       await page.getByRole("link", { name: "View Details" }).first().click();
    
//       await page.waitForSelector('[name="name"]', { state: "attached" });
//       await expect(page.locator('[name="name"]')).toHaveValue("Dublin Getaways");
//       await page.locator('[name="name"]').fill("Dublin Getaways UPDATED");
//       await page.getByRole("button", { name: "Save" }).click();
//       await expect(page.getByText("Hotel Saved!")).toBeVisible();
    
//       await page.reload();
    
//       await expect(page.locator('[name="name"]')).toHaveValue(
//         "Dublin Getaways UPDATED"
//       );
//       await page.locator('[name="name"]').fill("Dublin Getaways");
//       await page.getByRole("button", { name: "Save" }).click();
//     });

