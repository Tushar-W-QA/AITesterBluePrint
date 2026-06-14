# Automated API Test Runner using n8n

## Workflow

```text
Schedule Trigger
        ↓
HTTP Request
        ↓
Check Status Code
        ↓
Check Response Data
        ↓
Set Report Data
        ↓
Gmail
```

## Workflow Description

1. **Schedule Trigger**
   - Starts the workflow automatically at a configured time.

2. **HTTP Request**
   - Sends a request to the target API.

3. **Check Status Code**
   - Verifies that the API returns HTTP 200.

4. **Check Response Data**
   - Validates expected values in the response body.

5. **Set Report Data**
   - Creates a formatted test execution report.

6. **Gmail**
   - Sends the test result report via email.

## Features

- Automated API execution
- Status code validation
- Response data validation
- Email reporting
- Scheduled execution

## Nodes Used

- Schedule Trigger
- HTTP Request
- IF
- Set
- Gmail