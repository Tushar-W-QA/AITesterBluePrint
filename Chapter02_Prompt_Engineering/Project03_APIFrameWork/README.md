# Playwright API Automation Framework

Enterprise-grade Playwright API Automation Framework for the Restful Booker API, built with TypeScript and following SOLID principles.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Test Coverage](#test-coverage)
- [Key Features](#key-features)

---

## 🏗️ Project Structure

```
Project03_APIFrameWork/
├── BookingApi.ts                    # API Object Model (AOM) class
├── BookingApi.spec.ts               # Test specifications
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Project dependencies
├── tests/                           # Test files directory
│   └── BookingApi.spec.ts          # All test cases
├── dist/                            # Compiled JavaScript (generated)
├── playwright-report/               # Test reports (generated)
├── test-results/                    # Test results (generated)
└── README.md                        # This file
```

---

## 📦 Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **TypeScript**: v5.4.0 or higher
- **Playwright**: v1.48.0 or higher

---

## 🚀 Installation

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- `@playwright/test` — Testing framework
- `typescript` — TypeScript compiler
- `@types/node` — Node.js type definitions
- `rimraf` — Cross-platform rm -rf utility

### Step 2: Verify Installation

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

---

## ⚙️ Configuration

### Playwright Configuration

`playwright.config.ts` is pre-configured with:

- **Base URL**: `https://restful-booker.herokuapp.com`
- **Test Directory**: `./tests`
- **Timeout**: 30 seconds per test
- **Workers**: 1 (sequential execution to maintain test isolation)
- **Reporters**: HTML, JUnit XML, and console output
- **Projects**: Chromium browser

To modify:
1. Edit `playwright.config.ts`
2. Rebuild: `npm run build`

### TypeScript Configuration

`tsconfig.json` enforces:

- **Strict Mode**: All strict type checking enabled
- **No `any` Types**: `noImplicitAny` is true
- **Target**: ES2020
- **Module**: CommonJS

---

## 🧪 Usage

### Run All Tests

```bash
npm test
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Tests with UI Dashboard

```bash
npm run test:ui
```

### Run Tests in Headed Mode (Browser Visible)

```bash
npm run test:headed
```

### View Test Report

After tests complete:

```bash
npm run test:report
```

This opens the HTML report in your default browser.

---

## 🏛️ Architecture

### API Object Model (AOM)

The framework implements **API Object Model** (AOM), a design pattern where each API domain gets its own class.

#### BookingApi.ts

Encapsulates all Restful Booker API interactions:

| Method                                      | HTTP Verb | Endpoint         | Purpose                          |
|---------------------------------------------|-----------|------------------|----------------------------------|
| `createToken()`                             | POST      | /auth            | Generate authentication token    |
| `healthCheck()`                             | GET       | /ping            | Verify API health                |
| `getAllBookings()`                          | GET       | /booking         | Retrieve all bookings            |
| `getBookingById(id)`                        | GET       | /booking/:id     | Retrieve specific booking        |
| `createBooking(payload)`                    | POST      | /booking         | Create new booking               |
| `updateBooking(id, payload, token)`         | PUT       | /booking/:id     | Replace entire booking           |
| `partialUpdateBooking(id, payload, token)` | PATCH     | /booking/:id     | Update specific fields           |
| `deleteBooking(id, token)`                  | DELETE    | /booking/:id     | Delete booking                   |

**Key Implementation Details:**

- ✅ Wrapped in try-catch blocks with meaningful error re-throws
- ✅ Full TypeScript interfaces for all request/response payloads
- ✅ No `any` types
- ✅ Async/await throughout
- ✅ Returns full Playwright `APIResponse` objects
- ✅ Input validation on all methods
- ✅ No hard waits or fixed delays

### Type Safety

All payloads and responses are defined as TypeScript interfaces:

```typescript
interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

interface BookingResponse extends BookingPayload {
  bookingid: number;
}
```

---

## 🧬 Test Coverage

### Test Organization

Tests are organized into **7 describe blocks** with **16+ test cases**:

| Describe Block | # Tests | Coverage                                  |
|----------------|---------|-------------------------------------------|
| Auth           | 2       | Valid/invalid credentials                 |
| HealthCheck    | 1       | API ping endpoint                         |
| GetBookings    | 3       | Retrieve all, valid ID, invalid ID        |
| CreateBooking  | 3       | Valid payload, missing fields, invalid data|
| UpdateBooking  | 2       | Valid token, invalid token                |
| PartialUpdate  | 2       | Single field, multiple fields             |
| DeleteBooking  | 3       | Valid token, invalid token, non-existent ID|

### Test Lifecycle

```
beforeAll()
  ├─ Create APIRequestContext
  ├─ Generate auth token (dynamic)
  ├─ Create one booking
  └─ Capture bookingId (dynamic)

[Tests run sequentially]

afterAll()
  ├─ Delete created booking
  └─ Dispose APIRequestContext
```

### Validation Strategy

Each test validates:

1. **Status Code** — Expected HTTP response code
2. **Response Time** — Must be < 3000ms (SLA)
3. **Response Body** — Structure and type correctness
4. **Schema** — Key existence and correct data types

Example:

```typescript
test('Valid auth should return token', async () => {
  const startTime = Date.now();
  const response = await bookingApi.createToken();
  const responseTime = Date.now() - startTime;

  expect(response.status()).toBe(200);                    // Status code
  expect(responseTime).toBeLessThan(RESPONSE_TIME_SLA);   // Response time
  
  const data = await response.json();
  expect(data).toHaveProperty('token');                   // Schema
  expect(typeof data.token).toBe('string');               // Type
});
```

---

## ✨ Key Features

### 1. No Test Dependencies
- ✅ All tests are independent
- ✅ Each test creates its own test data
- ✅ Safe to run in any order
- ✅ No shared state pollution

### 2. Dynamic Token & Booking ID
- ✅ Token generated in `beforeAll()`, never hardcoded
- ✅ Booking IDs captured dynamically after creation
- ✅ No brittle hardcoded test data

### 3. Response Time Validation
- ✅ Every API call validated against 3000ms SLA
- ✅ Performance regressions caught early
- ✅ Configurable via `RESPONSE_TIME_SLA` constant

### 4. Full TypeScript Type Safety
- ✅ Strict mode enforced
- ✅ Zero `any` types
- ✅ Interfaces for all payloads and responses
- ✅ Compile-time type checking

### 5. Meaningful Error Handling
- ✅ All errors wrapped in try-catch
- ✅ Descriptive error messages
- ✅ Status codes included in error output
- ✅ Response bodies logged on failure

### 6. Clean, Maintainable Code
- ✅ Single Responsibility Principle
- ✅ DRY (Don't Repeat Yourself)
- ✅ No commented-out code
- ✅ Self-documenting method signatures

---

## 🔍 Running a Single Test

To run a specific test or describe block:

```bash
npx playwright test --grep "Auth"
```

Example patterns:

```bash
npx playwright test --grep "Valid credentials"           # Single test
npx playwright test --grep "GetBookings"                 # Entire describe block
npx playwright test --grep "Update|Delete"               # Multiple blocks (regex)
```

---

## 📊 Test Report

After running tests, access the HTML report:

```bash
npm run test:report
```

The report includes:

- ✅ Pass/fail status for each test
- ⏱️ Execution time per test
- 📈 Overall suite statistics
- 📝 Test traces (if enabled)
- 🐛 Failure details with error messages

---

## 🛠️ Build & Compile

### Compile TypeScript

```bash
npm run build
```

Output: JavaScript files in `dist/` folder

### Clean Build Artifacts

```bash
npm run clean
```

Removes the `dist/` folder.

---

## 🔐 Security Notes

- **Credentials**: Default credentials (`admin`/`password123`) are for the public Restful Booker demo API only
- **Tokens**: Never commit real auth tokens to version control
- **Environment Variables**: For production, use `.env` files for sensitive data (not included in `.gitignore` — add if needed)

---

## 📚 API Reference

### Restful Booker API

- **Base URL**: `https://restful-booker.herokuapp.com`
- **Documentation**: https://restful-booker.herokuapp.com/apidoc/index.html
- **Status**: Public demo API (may have limitations)

### Booking Date Format

All dates must be ISO 8601 format: `YYYY-MM-DD`

Example:
```typescript
{
  checkin: "2025-06-01",
  checkout: "2025-06-10"
}
```

---

## 🚨 Troubleshooting

### Tests Timeout

**Error**: `Timeout waiting for response`

**Solution**: Increase timeout in `playwright.config.ts`:

```typescript
timeout: 60000, // 60 seconds
```

### Authentication Fails

**Error**: `Failed to create token`

**Solution**: Verify credentials and API status:
```bash
curl https://restful-booker.herokuapp.com/ping
```

### Port Already in Use

**Error**: Port 3000 already in use (if using webServer)

**Solution**: Kill the process or change port in config

### Missing TypeScript Types

**Error**: `Cannot find module @types/node`

**Solution**: Reinstall dependencies:
```bash
npm install
```

---

## 📝 License

MIT

---

## 👤 Author

QA Automation Architect

**Framework Version**: 1.0.0

**Last Updated**: May 2026
