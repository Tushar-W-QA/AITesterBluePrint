import { test, expect, APIRequestContext } from '@playwright/test';
import { BookingApi, BookingPayload, CreateBookingResponse, AuthResponse, BookingResponse } from '../BookingApi';

let apiRequestContext: APIRequestContext;
let bookingApi: BookingApi;
let authToken: string;
let createdBookingId: number;

const RESPONSE_TIME_SLA = 3000;

test.beforeAll(async ({ playwright }) => {
  apiRequestContext = await playwright.request.newContext({
    baseURL: 'https://restful-booker.herokuapp.com',
  });

  bookingApi = new BookingApi(apiRequestContext);

  const tokenResponse = await bookingApi.createToken();
  expect(tokenResponse.status()).toBe(200);

  const tokenData: AuthResponse = await tokenResponse.json();
  authToken = tokenData.token;
  expect(authToken).toBeTruthy();
  expect(typeof authToken).toBe('string');

  const validBooking: BookingPayload = {
    firstname: 'John',
    lastname: 'Doe',
    totalprice: 500,
    depositpaid: true,
    bookingdates: {
      checkin: '2025-06-01',
      checkout: '2025-06-10',
    },
    additionalneeds: 'Breakfast',
  };

  const startTime = Date.now();
  const createResponse = await bookingApi.createBooking(validBooking);
  const responseTime = Date.now() - startTime;

  expect(createResponse.status()).toBe(200);
  expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

  const bookingData: CreateBookingResponse = await createResponse.json();
  createdBookingId = bookingData.bookingid;
  expect(createdBookingId).toBeTruthy();
  expect(typeof createdBookingId).toBe('number');
  expect(createdBookingId).toBeGreaterThan(0);
});

test.afterAll(async () => {
  if (createdBookingId && authToken) {
    try {
      await bookingApi.deleteBooking(createdBookingId, authToken);
    } catch (error) {
      console.warn('Warning: Could not delete booking in afterAll', error);
    }
  }

  if (apiRequestContext) {
    await apiRequestContext.dispose();
  }
});

test.describe('Auth', () => {
  test('Valid credentials should return token with 200 status', async () => {
    const startTime = Date.now();
    const response = await bookingApi.createToken('admin', 'password123');
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

    const data: AuthResponse = await response.json();
    expect(data).toHaveProperty('token');
    expect(typeof data.token).toBe('string');
    expect(data.token.length).toBeGreaterThan(0);
  });

  test('Invalid credentials should return 200 but with null/falsy token', async () => {
    const startTime = Date.now();
    const response = await bookingApi.createToken('invaliduser', 'invalidpassword');
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

    const data: AuthResponse = await response.json();
    expect(data).toHaveProperty('token');
  });
});

test.describe('HealthCheck', () => {
  test('GET /ping should return 201 status', async () => {
    const startTime = Date.now();
    const response = await bookingApi.healthCheck();
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(201);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

    const headers = response.headers();
    expect(headers['content-type']).toBeTruthy();
  });
});

test.describe('GetBookings', () => {
  test('GET /booking should return all bookings with 200 status', async () => {
    const startTime = Date.now();
    const response = await bookingApi.getAllBookings();
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(0);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('bookingid');
    }
  });

  test('GET /booking/:id with valid ID should return booking with 200 status', async () => {
    const startTime = Date.now();
    const response = await bookingApi.getBookingById(createdBookingId);
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

    const data: BookingResponse = await response.json();
    expect(data).toHaveProperty('firstname');
    expect(data).toHaveProperty('lastname');
    expect(data).toHaveProperty('totalprice');
    expect(data).toHaveProperty('depositpaid');
    expect(data).toHaveProperty('bookingdates');
    expect(typeof data.firstname).toBe('string');
    expect(typeof data.lastname).toBe('string');
    expect(typeof data.totalprice).toBe('number');
    expect(typeof data.depositpaid).toBe('boolean');
    expect(data.bookingdates).toHaveProperty('checkin');
    expect(data.bookingdates).toHaveProperty('checkout');
  });

  test('GET /booking/:id with invalid ID should return 404 status', async () => {
    const invalidId = 999999;

    let errorThrown = false;
    let errorMessage = '';

    try {
      await bookingApi.getBookingById(invalidId);
    } catch (error) {
      errorThrown = true;
      errorMessage = (error as Error).message;
    }

    expect(errorThrown).toBe(true);
    expect(errorMessage).toContain('404');
  });
});

test.describe('CreateBooking', () => {
  test('POST /booking with valid payload should return 200 and bookingid', async () => {
    const validPayload: BookingPayload = {
      firstname: 'Jane',
      lastname: 'Smith',
      totalprice: 750,
      depositpaid: false,
      bookingdates: {
        checkin: '2025-07-01',
        checkout: '2025-07-15',
      },
      additionalneeds: 'Late checkout',
    };

    const startTime = Date.now();
    const response = await bookingApi.createBooking(validPayload);
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

    const data: CreateBookingResponse = await response.json();
    expect(data).toHaveProperty('bookingid');
    expect(data).toHaveProperty('booking');
    expect(typeof data.bookingid).toBe('number');
    expect(data.bookingid).toBeGreaterThan(0);
    expect(data.booking.firstname).toBe(validPayload.firstname);
    expect(data.booking.lastname).toBe(validPayload.lastname);
    expect(data.booking.totalprice).toBe(validPayload.totalprice);

    if (data.bookingid) {
      await bookingApi.deleteBooking(data.bookingid, authToken);
    }
  });

  test('POST /booking with missing mandatory fields should fail', async () => {
    const invalidPayload = {
      firstname: 'Test',
    } as unknown as BookingPayload;

    let errorThrown = false;
    let errorMessage = '';

    try {
      await bookingApi.createBooking(invalidPayload);
    } catch (error) {
      errorThrown = true;
      errorMessage = (error as Error).message;
    }

    expect(errorThrown).toBe(true);
    expect(errorMessage).toContain('Missing required field');
  });

  test('POST /booking with invalid totalprice should fail', async () => {
    const invalidPayload = {
      firstname: 'Test',
      lastname: 'User',
      totalprice: -100,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-08-01',
        checkout: '2025-08-05',
      },
    } as unknown as BookingPayload;

    let errorThrown = false;
    let errorMessage = '';

    try {
      await bookingApi.createBooking(invalidPayload);
    } catch (error) {
      errorThrown = true;
      errorMessage = (error as Error).message;
    }

    expect(errorThrown).toBe(true);
    expect(errorMessage).toContain('totalprice');
  });
});

test.describe('UpdateBooking', () => {
  test('PUT /booking/:id with valid token and payload should return 200', async () => {
    const updatedPayload: BookingPayload = {
      firstname: 'John',
      lastname: 'Updated',
      totalprice: 600,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-06-01',
        checkout: '2025-06-10',
      },
      additionalneeds: 'Updated Breakfast',
    };

    const startTime = Date.now();
    const response = await bookingApi.updateBooking(createdBookingId, updatedPayload, authToken);
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

    const data: BookingResponse = await response.json();
    expect(data.firstname).toBe(updatedPayload.firstname);
    expect(data.lastname).toBe(updatedPayload.lastname);
    expect(data.totalprice).toBe(updatedPayload.totalprice);
  });

  test('PUT /booking/:id with invalid token should fail', async () => {
    const updatedPayload: BookingPayload = {
      firstname: 'Test',
      lastname: 'Invalid',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-06-01',
        checkout: '2025-06-10',
      },
    };

    let errorThrown = false;
    let errorMessage = '';

    try {
      await bookingApi.updateBooking(createdBookingId, updatedPayload, 'invalidtoken123');
    } catch (error) {
      errorThrown = true;
      errorMessage = (error as Error).message;
    }

    expect(errorThrown).toBe(true);
    expect(errorMessage).toContain('403');
  });
});

test.describe('PartialUpdate', () => {
  test('PATCH /booking/:id with partial payload and valid token should return 200', async () => {
    const partialPayload: Partial<BookingPayload> = {
      firstname: 'Jonathan',
      additionalneeds: 'Room with a view',
    };

    const startTime = Date.now();
    const response = await bookingApi.partialUpdateBooking(createdBookingId, partialPayload, authToken);
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

    const data: BookingResponse = await response.json();
    expect(data.firstname).toBe(partialPayload.firstname);
    expect(data).toHaveProperty('lastname');
    expect(data).toHaveProperty('bookingdates');
  });

  test('PATCH /booking/:id with only totalprice should update only that field', async () => {
    const currentBooking = await bookingApi.getBookingById(createdBookingId);
    const originalData: BookingResponse = await currentBooking.json();

    const partialPayload: Partial<BookingPayload> = {
      totalprice: 999,
    };

    const startTime = Date.now();
    const response = await bookingApi.partialUpdateBooking(createdBookingId, partialPayload, authToken);
    const responseTime = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);

    const updatedData: BookingResponse = await response.json();
    expect(updatedData.totalprice).toBe(999);
    expect(updatedData.firstname).toBe(originalData.firstname);
    expect(updatedData.lastname).toBe(originalData.lastname);
  });
});

test.describe('DeleteBooking', () => {
  test('DELETE /booking/:id with valid token should return 201 status', async () => {
    const tempBooking: BookingPayload = {
      firstname: 'Temp',
      lastname: 'Delete',
      totalprice: 100,
      depositpaid: false,
      bookingdates: {
        checkin: '2025-09-01',
        checkout: '2025-09-05',
      },
    };

    const createResponse = await bookingApi.createBooking(tempBooking);
    const createData: CreateBookingResponse = await createResponse.json();
    const tempBookingId = createData.bookingid;

    const startTime = Date.now();
    const deleteResponse = await bookingApi.deleteBooking(tempBookingId, authToken);
    const responseTime = Date.now() - startTime;

    expect(deleteResponse.status()).toBe(201);
    expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);
  });

  test('DELETE /booking/:id with invalid token should fail', async () => {
    let errorThrown = false;
    let errorMessage = '';

    try {
      await bookingApi.deleteBooking(createdBookingId, 'invalidtoken123');
    } catch (error) {
      errorThrown = true;
      errorMessage = (error as Error).message;
    }

    expect(errorThrown).toBe(true);
    expect(errorMessage).toContain('403');
  });

  test('DELETE /booking/:id that does not exist should return 405', async () => {
    const nonExistentId = 999999;

    let errorThrown = false;
    let errorMessage = '';

    try {
      await bookingApi.deleteBooking(nonExistentId, authToken);
    } catch (error) {
      errorThrown = true;
      errorMessage = (error as Error).message;
    }

    expect(errorThrown).toBe(true);
    expect(errorMessage).toContain('405');
  });
});
