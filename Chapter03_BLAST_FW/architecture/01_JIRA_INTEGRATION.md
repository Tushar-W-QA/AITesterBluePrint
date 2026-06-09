# SOP: Jira Integration Layer

## Goal
Fetch a Jira issue by ID using REST API and extract required fields for test plan generation.

## Input
- Jira Issue ID (e.g., `KAN-12`)
- Jira Base URL (from `JIRA_URL` env var)
- Jira Email (from `JIRA_EMAIL` env var)
- Jira API Token (from `JIRA_TOKEN` env var)

## Process
1. Construct API endpoint: `{JIRA_URL}/rest/api/3/issues/{issueId}`
2. Create Basic Auth header using `JIRA_EMAIL` and `JIRA_TOKEN`
3. Send GET request to Jira API
4. Parse response and extract fields:
   - `key`: Issue ID
   - `summary`: Issue summary
   - `description`: Issue description
   - `acceptanceCriteria`: Custom field (if exists)
   - `labels`: Array of labels
   - `components`: Array of components
   - `priority`: Priority level
   - `issuetype`: Issue type
   - `customfield_*`: Additional fields as needed
5. Return extracted object to caller

## Output
```json
{
  "issueId": "KAN-12",
  "summary": "string",
  "description": "string",
  "acceptanceCriteria": "string",
  "labels": ["string"],
  "components": ["string"],
  "priority": "string",
  "issueType": "string",
  "reporter": "string",
  "assignee": "string"
}
```

## Error Handling
- Invalid Jira ID: Return 404 error message
- Auth failure: Return 401 error message
- Network error: Retry 3 times, then fail with error message
- Invalid JSON response: Log and return generic error

## Edge Cases
- Missing optional fields: Use empty string or empty array
- Special characters in description: Encode properly for markdown
- Very long descriptions: Truncate or handle gracefully
