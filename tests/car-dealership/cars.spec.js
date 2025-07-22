import { test, expect, request } from '@playwright/test';

const { BASE_URL, } = process.env;

const homeUrl = `${BASE_URL}/`;
const swaggerUrl = `${BASE_URL}/api`;
const carsUrl = `${BASE_URL}/cars`;
// const loginUrl = `${BASE_URL}/login`;

test.describe('Cars API', () => {
// test.describe.configure({ mode: 'serial' });

test('Get index', async ({ page }) => {
    await page.goto(homeUrl);   
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Hello World!')).toBeVisible();

    // await expect(page.getByRole('heading', { name: 'Car Dealership' })).toBeVisible();
    // await expect(page.getByRole('link', { name: 'Create New Car' })).toBeVisible();
    // await expect(page.getByRole('link', { name: 'Get All Cars' })).toBeVisible();
    // await expect(page.getByRole('link', { name: 'Get Car by ID' })).toBeVisible();
    // await expect(page.getByRole('link', { name: 'Update Car by ID' })).toBeVisible();
    // await expect(page.getByRole('link', { name: 'Delete Car by ID'  })).toBeVisible();
    // await expect(page.getByRole('link', { name: 'Swagger API' })).toBeVisible();
});

test('Get swagger', async ({ page }) => {
    await page.goto(swaggerUrl);   
    await page.waitForLoadState('load');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Swagger UI/);
    await expect(page.getByText('Car Dealership API')).toBeVisible();
});

test('Get All Cars', async ({ request }) => {
    const response = await request.get(carsUrl);
    expect(response.ok()).toBeTruthy();
    const cars = await response.json();
    expect(Array.isArray(cars)).toBe(true);
});

test('Create New Car', async ({ request }) => {
    const response = await request.post(carsUrl, {
      data: {
        make: "Toyota",
        model: "Corolla",
        year: 2020,
        price: 15000
      }
    });
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.make).toBe("Toyota");
});

test('Get All Cars again', async ({ request }) => {
    const response = await request.get(carsUrl);
    expect(response.ok()).toBeTruthy();
    const cars = await response.json();
    expect(Array.isArray(cars)).toBe(true);
});

test('Get Car by ID', async ({ request }) => {
    // First, create a car to get its ID
    const create = await request.post(carsUrl, {
      data: {
        make: "Honda",
        model: "Civic",
        year: 2022,
        price: 18000
      }
    });
    const createdCar = await create.json();
    const carId = createdCar.id;

    const response = await request.get(`${carsUrl}/${carId}`);
    expect(response.ok()).toBeTruthy();
    const car = await response.json();
    expect(car.id).toBe(carId);
});

test('Update Car by ID', async ({ request }) => {
    // Create a car first
    const create = await request.post(carsUrl, {
      data: {
        make: "Ford",
        model: "Focus",
        year: 2018,
        price: 10000
      }
    });
    const car = await create.json();
    const carId = car.id;

    // Update the car
    const update = await request.put(`${carsUrl}/${carId}`, {
      data: {
        make: "Ford",
        model: "Focus",
        year: 2019,
        price: 9500
      }
    });
    expect(update.ok()).toBeTruthy();
});

test('Delete Car by ID', async ({ request }) => {
    // Create a car first
    const create = await request.post(carsUrl, {
      data: {
        make: "BMW",
        model: "X5",
        year: 2021,
        price: 35000
      }
    });
    const car = await create.json();
    const carId = car.id;

    // Delete the car
    const del = await request.delete(`${carsUrl}/${carId}`);
    expect(del.ok()).toBeTruthy();
});


});