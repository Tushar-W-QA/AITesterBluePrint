# Jira Test Plan Generator

A lightweight React-based application that automatically fetches Jira issues and generates comprehensive test plans using GROQ AI (openai/gpt-oss-120b).

## Features

- 🔐 Secure settings management (localStorage)
- 📝 Automatic Jira issue fetching
- 🤖 AI-powered test plan generation using GROQ
- 📥 Download and copy test plans
- 🎨 Clean, responsive UI with TailwindCSS
- ⚡ Fast and lightweight (no backend required)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **AI**: GROQ API (openai/gpt-oss-120b model)

## Setup

### Prerequisites

- Node.js 16+
- npm or yarn
- GROQ API key (free tier available)
- Jira instance with API token access

### Installation

1. Clone or navigate to the project:
   ```bash
   cd Chapter03_BLAST_FW
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with your credentials:
   ```
   GROQ_KEY=your_groq_api_key
   JIRA_EMAIL=your_jira_email
   JIRA_TOKEN=your_jira_api_token
   JIRA_URL=https://your-domain.atlassian.net
   ```

### Development

Run the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Build

Create production build:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Usage

### 1. Configure Settings

- Go to **Settings** tab
- Enter your Jira Base URL, Email, and API Token
- Enter your GROQ API Key
- Click **Save Settings**

### 2. Generate Test Plan

- Go to **Test Plan Generator** tab
- Enter a Jira Issue ID (e.g., `KAN-12`)
- Click **Fetch Issue** to retrieve the issue details
- Review the Jira issue data
- Click **Generate Test Plan**
- Wait for AI to generate the test plan
- Download or copy the generated markdown

## Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── services/            # API integration services
│   ├── store/               # Zustand store
│   ├── types/               # TypeScript types
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind CSS
├── architecture/            # BLAST Phase 3 SOPs
├── .env                     # Environment variables
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── index.html               # HTML template
```

## BLAST Framework

This project follows the BLAST protocol:

- **Phase 0**: ✅ Initialization (Memory files created)
- **Phase 1**: ✅ Blueprint (Discovery & schema defined)
- **Phase 2**: ✅ Link (API connectivity verified)
- **Phase 3**: ✅ Architect (3-layer architecture)
- **Phase 4**: ✅ Stylize (UI/UX implemented)
- **Phase 5**: 🔄 Trigger (Ready for deployment)

## API Integration

### Jira API

- **Endpoint**: `{JIRA_URL}/rest/api/3/issues/{issueId}`
- **Auth**: Basic Auth (email:token)
- **Method**: GET

### GROQ API

- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Model**: `openai/gpt-oss-120b`
- **Auth**: Bearer token

## Security

- API keys are stored in browser localStorage (not sent to any server)
- All API calls are made directly from the browser
- No backend server required
- Sensitive data never persisted beyond browser session (can be cleared from Settings)

## Error Handling

The app includes comprehensive error handling for:
- Invalid Jira credentials
- Network failures
- API rate limits
- Missing configuration

## Testing

Run tests:
```bash
npm run lint
```

## Troubleshooting

### "Failed to fetch Jira issue"
- Verify Jira credentials are correct
- Check if Jira URL is accessible
- Ensure API token has appropriate permissions

### "Generation failed"
- Check GROQ API key is valid
- Verify GROQ account has available quota
- Check network connectivity

### Settings not saving
- Ensure localStorage is enabled in browser
- Check browser privacy settings
- Try clearing browser cache

## Contributing

Follow the BLAST framework for any updates:
1. Update architecture SOPs if logic changes
2. Update progress.md after completing work
3. Keep gemini.md as the source of truth

## License

MIT

## Version

0.1.0

## Support

For issues or feature requests, refer to the BLAST framework documentation.
