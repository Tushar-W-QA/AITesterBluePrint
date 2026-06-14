# Website Uptime Monitor using n8n

## Overview

This project is a simple website uptime monitoring workflow built using n8n Cloud. The workflow automatically checks a website every 5 minutes and logs the execution details into Google Sheets.

The project demonstrates:

* Workflow scheduling
* HTTP API requests
* Data transformation
* Google Sheets integration
* Automation monitoring

---

## Workflow Architecture

```text
Schedule Trigger → HTTP Request → Edit Fields → Google Sheets
```

---

## Features

* Automatically runs every 5 minutes
* Checks website availability
* Records execution timestamp
* Stores website information
* Logs status into Google Sheets
* Easy to extend with Email or Slack alerts

---

## Technologies Used

* n8n Cloud
* HTTP Request Node
* Schedule Trigger Node
* Edit Fields (Set) Node
* Google Sheets Node
* Google Sheets

---

## Workflow Steps

### 1. Schedule Trigger

Runs the workflow every 5 minutes.

**Purpose:**

* Automates execution without manual intervention.

### 2. HTTP Request

Sends a GET request to the target website.

**Example URL:**

```text
https://google.com
```

**Purpose:**

* Verifies that the website is reachable.

### 3. Edit Fields

Creates custom fields:

| Field     | Value                  |
| --------- | ---------------------- |
| Timestamp | Current execution time |
| Website   | google.com             |
| Status    | UP                     |

**Purpose:**

* Formats data before sending it to Google Sheets.

### 4. Google Sheets

Appends a new row for every workflow execution.

**Purpose:**

* Maintains historical monitoring data.

---

## Google Sheet Structure

| Timestamp        | Website    | Status |
| ---------------- | ---------- | ------ |
| 2025-06-14 10:00 | google.com | UP     |
| 2025-06-14 10:05 | google.com | UP     |

---

## Expected Result

After publishing the workflow:

* The workflow runs every 5 minutes.
* A new row is added to Google Sheets.
* Execution history can be verified from the n8n Executions page.

---

## Verification Steps

1. Publish the workflow.
2. Wait 5 minutes.
3. Open **Executions** in n8n.
4. Verify successful executions.
5. Open Google Sheets.
6. Confirm new rows are being added.

---

## Future Enhancements

* Email alerts when the website is down
* Slack notifications
* Multiple website monitoring
* Response time tracking
* Daily monitoring reports

---

## Author

**Tushar Warad QA Automation Engineer with N8N**
