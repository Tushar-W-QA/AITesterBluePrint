# SOP: React Application Flow

## Goal
Provide a lightweight React UI for configuring Jira/GROQ credentials and generating test plans.

## Components

### 1. Settings Panel
- Input fields for:
  - JIRA_URL
  - JIRA_EMAIL
  - JIRA_TOKEN
  - GROQ_KEY
- Save settings to localStorage
- Validate inputs before save

### 2. Test Plan Generator Panel
- Input field for Jira Issue ID
- Button to fetch issue
- Loading state during fetch
- Error display if fetch fails
- Display extracted Jira data
- Button to generate test plan
- Loading state during generation
- Display generated markdown
- Button to copy to clipboard
- Button to save to workspace file

### 3. Results Display
- Show formatted markdown preview
- Show metadata (issue ID, timestamp, model)
- Copy and save actions

## User Flow
1. User opens React app
2. User enters Jira and GROQ credentials in Settings Panel
3. User saves settings (stored in localStorage)
4. User enters Jira Issue ID in Generator Panel
5. User clicks "Fetch Issue"
   - App calls Jira API
   - Displays extracted fields
6. User clicks "Generate Test Plan"
   - App calls GROQ API
   - Displays loading spinner
7. App displays generated markdown
8. User can copy or save to file

## State Management
- Settings (Jira URL, Email, Token, GROQ Key)
- Current Issue ID
- Fetched Jira Data
- Generated Markdown
- Loading State
- Error State

## Error Handling
- Show user-friendly error messages
- Log errors to console for debugging
- Validate form inputs before submission
- Retry failed API calls

## Performance
- Debounce input fields
- Cache Jira fetch results
- Lazy load markdown preview
- Minimize re-renders
