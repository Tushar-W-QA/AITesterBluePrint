# RICE-POT Prompt — Enterprise Playwright API Automation Framework

---

## R — ROLE

You are a Senior QA Automation Architect with 15 years of hands-on experience specializing in API test automation using Playwright and TypeScript at enterprise scale. You design clean, scalable, maintainable API automation frameworks following AOM (API Object Model) patterns, SOLID principles, and production-grade coding standards.

---

## I — INSTRUCTIONS

1. Generate a complete, enterprise-grade Playwright API Automation Framework in TypeScript.
2. Target API: `https://restful-booker.herokuapp.com/`
3. Use Playwright Test Framework exclusively — no other test runners.
4. Apply lifecycle hooks: `test.beforeAll()`, `test.beforeEach()`, `test.afterEach()`, `test.afterAll()` wherever appropriate.
5. Implement structured `try-catch` blocks with meaningful error propagation in all API utility methods.
6. Follow AOM (API Object Model) — not POM. Each API domain gets its own class.
7. Use `APIRequestContext` from Playwright for all HTTP calls.
8. Use Playwright built-in `expect` assertions only — no third-party assertion libraries.
9. Validate: status codes, response headers, response body structure, response schema (key existence + types), and response time (must be under 3000ms).
10. Auth token must be generated dynamically in `beforeAll` — never hardcoded.
11. `bookingId` must be captured dynamically after `createBooking` — never hardcoded.
12. All test cases must be independent and idempotent.
13. Use `async/await` throughout — no callbacks, no `.then()` chains.
14. Use TypeScript interfaces for all request payloads and response shapes — no `any` types.
15. No hard waits, no `waitForTimeout()`, no fixed delays.

---

## C — CONTEXT

The target system is the Restful Booker API — a hotel booking management system.

The API flow has the following dependency chain that must be respected:

```
Authenticate → Create Booking → Capture bookingId → GET / PUT / PATCH / DELETE using that bookingId
```

There is also a health check endpoint (`GET /ping`) that must be verified independently.

All booking operations (update, partial update, delete) require a valid auth token passed as a `Cookie` header in the format:

```
Cookie: token=<dynamic_token>
```

---

## E — EXAMPLES

**Auth — POST /auth**

```json
Request Body:
{
  "username": "admin",
  "password": "password123"
}

Response:
{
  "token": "abc123"
}
```

**Create Booking — POST /booking**

```json
Request Body:
{
  "firstname": "Jim",
  "lastname": "Brown",
  "totalprice": 111,
  "depositpaid": true,
  "bookingdates": {
    "checkin": "2025-01-01",
    "checkout": "2025-01-10"
  },
  "additionalneeds": "Breakfast"
}
```

**GET Booking — GET /booking/:id**

```
Response: full booking object matching the above shape
```

**DELETE Booking — DELETE /booking/:id**

```
Header: Cookie: token=abc123
Response: 201 Created (Restful Booker convention for successful delete)
```

**Health Check — GET /ping**

```
Response: 201 Created
```

---

## P — PARAMETERS

| Parameter | Constraint |
|---|---|
| Language | TypeScript — strict mode enforced |
| Type Safety | No `any` types — define interfaces for every payload and response |
| Response Time SLA | All API responses must complete within **3000ms** |
| Test Coverage | Minimum **15 test cases** covering valid, invalid, and edge cases |
| Token Handling | Dynamically captured in `beforeAll` — never hardcoded |
| Booking ID Handling | Dynamically captured after `createBooking` — never hardcoded |
| Test Isolation | All tests must be independent — no test depends on another's state |
| Libraries | No third-party libraries beyond `@playwright/test` |
| Waits | No `waitForTimeout()`, no `setTimeout()`, no fixed delays |
| Code Style | No callbacks, no `.then()` chains — `async/await` only |

---

## O — OUTPUT

Generate exactly **2 files**:

### File 1 — `BookingApi.ts`

- Export a class `BookingApi` with a constructor accepting `APIRequestContext`
- Implement the following methods, each returning the full Playwright `APIResponse` object:

| Method | Description |
|---|---|
| `createToken()` | POST /auth with valid credentials |
| `healthCheck()` | GET /ping |
| `getAllBookings()` | GET /booking |
| `getBookingById(id: number)` | GET /booking/:id |
| `createBooking(payload: BookingPayload)` | POST /booking |
| `updateBooking(id: number, payload: BookingPayload, token: string)` | PUT /booking/:id |
| `partialUpdateBooking(id: number, payload: Partial<BookingPayload>, token: string)` | PATCH /booking/:id |
| `deleteBooking(id: number, token: string)` | DELETE /booking/:id |

- All methods must be wrapped in `try-catch` with meaningful error re-throw
- All request/response shapes must use TypeScript interfaces — no `any`

### File 2 — `BookingApi.spec.ts`

- `beforeAll`: Initialize `APIRequestContext`, generate auth token, create one booking, capture `bookingId`
- `afterAll`: Delete the created booking, dispose `APIRequestContext`
- Organize tests using `test.describe` blocks:

| Describe Block | Tests Included |
|---|---|
| `Auth` | Valid credentials, invalid credentials |
| `HealthCheck` | GET /ping returns 201 |
| `GetBookings` | GET all, GET by valid ID, GET by invalid ID |
| `CreateBooking` | Valid payload, missing mandatory fields |
| `UpdateBooking` | Valid token, invalid token |
| `PartialUpdate` | PATCH with partial payload |
| `DeleteBooking` | Valid token, invalid token |

- Each test must validate: **status code + response time + response body/schema**

> No explanations. No comments. No markdown. No folder structure. No installation steps. Output runnable TypeScript code only.

---

## T — TONE

Technical. Precise. Zero prose. Enterprise-grade TypeScript only.
No comments inside code. No markdown formatting in output. Runnable files delivered directly.
