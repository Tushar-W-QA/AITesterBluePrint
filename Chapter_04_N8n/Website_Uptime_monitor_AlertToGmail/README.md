# Website Uptime Monitor using n8n

## Project

A simple website uptime monitoring workflow built using n8n that checks website availability every 5 minutes and sends an email alert when the website becomes unavailable.

---

## Features

* Runs every 5 minutes
* Checks website availability
* Sends email alert if website is down

---

## Nodes Used

* Schedule Trigger
* HTTP Request
* IF
* Gmail

---

## Workflow

```text
Schedule Trigger → HTTP Request → IF → Gmail
```

### Workflow Description

#### 1. Schedule Trigger

* Executes the workflow every 5 minutes automatically.

#### 2. HTTP Request

* Sends a GET request to the target website.
* Verifies whether the website is reachable.

#### 3. IF Node

* Evaluates the HTTP response.
* If the website is down or returns an error, the workflow proceeds to the Gmail node.

#### 4. Gmail

* Sends an email notification indicating that the website is unavailable.

---

## Expected Result

* Website is checked every 5 minutes.
* No email is sent when the website is available.
* An email alert is sent immediately when the website is down.

---

## Future Enhancements

* Monitor multiple websites
* Add Slack notifications
* Log results to Google Sheets
* Track website response times
* Generate daily uptime reports

---

## Author

**Tushar Warad QA Automation Engineer with N8N**