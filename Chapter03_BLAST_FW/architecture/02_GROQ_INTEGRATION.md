# SOP: GROQ LLM Integration Layer

## Goal
Send Jira issue data to GROQ API and generate a markdown test plan.

## Input
```json
{
  "issueId": "string",
  "summary": "string",
  "description": "string",
  "acceptanceCriteria": "string",
  "labels": "string[]",
  "components": "string[]",
  "priority": "string",
  "issueType": "string"
}
```

## Process
1. Construct prompt:
   ```
   You are a QA test plan generator. Based on the Jira issue below, generate a comprehensive markdown test plan with only test plan sections.
   
   Issue ID: {issueId}
   Summary: {summary}
   Description: {description}
   Acceptance Criteria: {acceptanceCriteria}
   Labels: {labels}
   Components: {components}
   Priority: {priority}
   Issue Type: {issueType}
   
   Generate a markdown test plan with sections for:
   - Test Scope
   - Test Strategy
   - Test Cases
   - Test Data
   - Expected Results
   - Acceptance Criteria
   
   Output ONLY markdown. No explanations.
   ```

2. Call GROQ API:
   - Endpoint: `https://api.groq.com/openai/v1/chat/completions`
   - Model: `openai/gpt-oss-120b`
   - Max tokens: 2000
   - Temperature: 0.7

3. Extract `content` from response

## Output
```json
{
  "issueId": "string",
  "generatedMarkdown": "string",
  "timestamp": "ISO8601 string",
  "model": "openai/gpt-oss-120b"
}
```

## Error Handling
- Invalid API key: Return 401 error message
- Rate limit exceeded: Wait 60 seconds and retry
- Invalid response: Log full response and return generic error
- Network timeout: Retry up to 3 times

## Edge Cases
- Empty Jira issue data: Use default prompt with minimal info
- Very long descriptions: Truncate to 1000 chars for API call
- Special characters in data: Escape properly for JSON
- API response partial: Return what's available
