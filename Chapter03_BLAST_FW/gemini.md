# Gemini: Project Constitution

## Purpose
Define the input and output data shapes for the Jira test plan generator.

## Data Schema

### Input Schema
```json
{
  "jiraIssue": {
    "issueId": "KAN-12",
    "projectKey": "string",
    "issueType": "string"
  },
  "jiraCredentials": {
    "baseUrl": "https://your-domain.atlassian.net",
    "email": "user@example.com",
    "apiToken": "string"
  },
  "fetchFields": [
    "summary",
    "description",
    "acceptanceCriteria",
    "labels",
    "components",
    "priority",
    "issueType",
    "storyPoints",
    "assignee",
    "reporter"
  ],
  "output": {
    "markdownFilePath": "string"
  }
}
```

### Output Schema
```json
{
  "testPlan": {
    "jiraIssueId": "KAN-12",
    "summary": "string",
    "description": "string",
    "acceptanceCriteria": "string",
    "labels": ["string"],
    "components": ["string"],
    "priority": "string",
    "issueType": "string",
    "storyPoints": "string",
    "assignee": "string",
    "reporter": "string",
    "generatedMarkdown": "string",
    "markdownFilePath": "string"
  }
}
```

## Behavioral Rules
- Only use Jira issue fields as the source of truth.
- Output a markdown file containing test plan sections only.
- Do not invent Jira fields or test plan content beyond what the issue provides.
- The generator should be data-first and schema-driven.

## Runtime Contract
- The generator must accept:
  - Jira issue ID
  - Jira base URL
  - Jira user email
  - Jira API token
  - GROQ API key
  - LLM model: `openai/gpt-oss-120b`
  - Destination markdown file path
- The output must include the markdown text and the saved file path.

## Environment Variables (.env)
```
GROQ_KEY=<api_key>
JIRA_EMAIL=<email>
JIRA_TOKEN=<token>
JIRA_URL=<url>
```

## Technology Stack
- Frontend: React 18+ (TypeScript, Vite)
- UI: TailwindCSS
- API Integration: Jira REST API + GROQ API
- State Management: React Context / Zustand
- Deployment: Lightweight, no backend required
- Build: Vite

## Integration Flow
1. User enters Jira ID in React UI
2. React app fetches Jira issue from JIRA_URL using JIRA_EMAIL and JIRA_TOKEN
3. Extracted Jira fields sent to GROQ API (openai/gpt-oss-120b)
4. GROQ generates markdown test plan
5. React app displays and saves the test plan to workspace
