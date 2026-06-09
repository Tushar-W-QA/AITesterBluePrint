# SOP: File Operations

## Goal
Save generated test plan markdown to workspace file with proper naming convention.

## Input
- Generated markdown text
- Jira Issue ID (e.g., `KAN-12`)
- Optional: custom filename

## Process
1. Construct filename:
   - Format: `{JIRA_ID}-test-plan.md`
   - Example: `KAN-12-test-plan.md`

2. Determine save path:
   - Create `/test-plans/` directory in workspace if it doesn't exist
   - Save to: `{workspace}/test-plans/{filename}`

3. Write file:
   - Encoding: UTF-8
   - Include metadata header:
     ```markdown
     # Test Plan: {JIRA_ID}
     
     Generated: {timestamp}
     Model: openai/gpt-oss-120b
     ---
     
     {markdown_content}
     ```

## Output
```json
{
  "success": true,
  "filePath": "string",
  "fileName": "string",
  "byteSize": number
}
```

## Error Handling
- Insufficient permissions: Return permission error
- Disk space error: Return space error
- Invalid filename: Sanitize and retry
- File already exists: Append timestamp to filename

## Edge Cases
- Very long Jira ID: Truncate if needed
- Special characters in ID: Replace with underscore
- Unicode in markdown: Handle encoding properly
