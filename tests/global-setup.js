import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const { BASE_URL, VALID_USERNAME, VALID_PASSWORD } = process.env;

const homeUrl = `${BASE_URL}/`;
// const loginUrl = `${BASE_URL}/login`;
// const swaggerUrl = `${BASE_URL}/api`;
// const carsUrl = `${BASE_URL}/cars`;

module.exports = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // navigate to the page
  await page.goto(homeUrl);
  // wait for the page to load
  // await page.waitForURL(swaggerUrl);

  // save login session (cookies, localStorage, dll)
  await page.context().storageState({ path: 'state.json' });
  // read from ".env" file.
  dotenv.config({ path: path.resolve(__dirname, '.env') });

  await browser.close();
};