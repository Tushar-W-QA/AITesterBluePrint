# BLAST Findings

## Discovery Summary
- **North Star**: Automatically fetch a Jira issue and generate a complete markdown test plan using GROQ AI
- **Integrations**: Jira REST API v3 + GROQ API (openai/gpt-oss-120b free tier)
- **Source of Truth**: Jira issue fields only (no external requirements documents)
- **Delivery Payload**: Markdown file saved to workspace + clipboard copy + browser download
- **Behavioral Rules**: Output only test plan sections, deterministic, no hallucination

## Known Constraints
- ✅ Jira API credentials must be provided by user (not stored in code)
- ✅ GROQ API key must be provided by user (free tier available)
- ✅ No backend server required (client-side only)
- ✅ Browser localStorage used for settings (can be cleared)
- ✅ Credentials never sent to external servers except Jira and GROQ
- ✅ API rate limits apply: GROQ free tier has quotas, Jira API has standard limits

## Required Jira Fields
- `key`: Issue ID (e.g., KAN-12)
- `summary`: Issue summary/title
- `description`: Detailed description (supports rich text)
- `labels`: Array of labels
- `components`: Array of components
- `priority`: Priority level
- `issuetype`: Issue type
- `reporter`: Reporter name
- `assignee`: Assignee name

## Optional Custom Fields
- `acceptanceCriteria`: Custom field for acceptance criteria
- `storyPoints`: Story points (if using Scrum)
- Other custom fields extracted as needed

## Technology Decisions
1. **React + TypeScript**: Type-safe, component-based development
2. **Vite**: Fast build tool, optimized dev experience
3. **TailwindCSS**: Utility-first CSS for rapid UI development
4. **Zustand**: Lightweight state management (simpler than Redux)
5. **Axios**: Reliable HTTP client with retry support
6. **GROQ Free Tier**: openai/gpt-oss-120b model (no cost)

## Architecture Insights
- **3-Layer Design**: SOPs (architecture) → Navigation (React) → Tools (services)
- **Determinism**: Business logic in SOPs, LLM in separate service
- **Error Handling**: Graceful failures with user-friendly messages
- **Stateless Services**: Each service call is independent and testable
- **LocalStorage**: Settings persist between sessions (user-controlled)

## API Integration Details

### Jira Authentication
- Method: Basic Auth (email:token)
- Encoding: Base64 of `email:token`
- Header: `Authorization: Basic {base64}`
- Rate Limit: Standard Jira API limits apply (typically 1000-10000 requests/minute)

### GROQ API Integration
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Auth: Bearer token in header
- Model: `openai/gpt-oss-120b` (free tier)
- Max Tokens: 2000 (customizable)
- Temperature: 0.7 (customizable)
- Rate Limit: Free tier has daily quota (typically 7,000 requests/day)

## Prompt Engineering
The GROQ prompt is structured to:
1. Provide system context about QA test planning
2. Include all Jira issue data as context
3. Request specific markdown sections
4. Enforce markdown-only output
5. Avoid hallucination by being explicit

## File Operations
- Download: Creates blob, triggers browser download
- Clipboard: Uses modern Clipboard API (navigator.clipboard)
- Naming: `{JIRA-ID}-test-plan.md` format
- Encoding: UTF-8 with markdown metadata header

## Error Scenarios Handled
1. Invalid Jira ID → 404 error message
2. Auth failure (bad credentials) → 401 error message
3. Network error → Retry mechanism with user feedback
4. Invalid GROQ API key → 401 error message
5. Rate limit exceeded → Inform user to wait
6. Incomplete response → Use partial data with warning
7. Missing optional fields → Use sensible defaults

## Performance Considerations
- API calls are async (non-blocking)
- Loading states keep UI responsive
- Local state caching for fetched issues
- Debounced input to avoid rapid requests
- Markdown preview optimized with overflow handling

## Security Considerations
- ✅ No credentials sent to backend (client-side only)
- ✅ No credentials logged or exposed in console
- ✅ localStorage used for client-side storage only
- ✅ Users can clear settings anytime
- ✅ HTTPS recommended for production
- ✅ Browser same-origin policy protects against CSRF

## Scalability Notes
- App is lightweight (minimal dependencies)
- Can handle multiple Jira issue fetches
- No database required (stateless)
- Can be deployed as static site on CDN
- Scales based on user's API quotas (not backend)

## Testing Recommendations
1. Test with real Jira instance (not mock API)
2. Test with various Jira issue types
3. Test with long descriptions and edge cases
4. Test GROQ API with rate limits
5. Test network failures and retries
6. Test localStorage persistence
7. Test accessibility with keyboard navigation

## Deployment Recommendations
1. Use environment variables (or .env file)
2. Build with `npm run build`
3. Deploy `dist/` folder to CDN (Vercel, Netlify, GitHub Pages)
4. Enable HTTPS for security
5. Set up error tracking (optional Sentry, LogRocket)
6. Monitor GROQ and Jira API usage

## Future Enhancements (Not in Scope for Phase 5)
1. Batch processing (multiple issues at once)
2. Template selection for different test plan formats
3. Jira comment posting (post test plan back to issue)
4. Export to PDF or Word format
5. Integration with other ALM tools (Azure DevOps, etc.)
6. Custom LLM prompts configuration
7. Test case management system integration
8. Historical test plan versioning

## Open Questions Resolved
- ✅ Should generated markdown file open automatically in editor? → Option to download
- ✅ Should naming convention be enforced? → Yes, `{JIRA-ID}-test-plan.md`
- ✅ Should optional Jira fields be included only when present? → Yes, with graceful defaults
- ✅ Should backend be required? → No, client-side only (simpler)
- ✅ Should support batch operations? → Single issue focus for MVP

## Lessons Learned
1. GROQ API is excellent for free tier test plan generation
2. Basic Auth with Jira is simple but requires URL encoding
3. React components should be small and focused (single responsibility)
4. TailwindCSS significantly speeds up UI development
5. Zustand is perfect for this scale of state management
6. LocalStorage is sufficient for credential management at this stage
7. Error handling is critical for API integrations
8. SOPs should be written before code (BLAST principle proven valuable)
