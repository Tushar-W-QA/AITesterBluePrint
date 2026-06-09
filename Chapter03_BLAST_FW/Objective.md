# Objective: Jira Test Plan Generator

## SCRUM-5: Fetch The Test Plan & Create React Application

### Mission Statement
Build a lightweight React-based application that automatically fetches Jira issues and generates comprehensive markdown test plans using GROQ AI (openai/gpt-oss-120b free tier).

### Detailed Requirements
- **Jira Configuration**: Accept email ID, base URL, and API token
- **GROQ Connection**: Accept GROQ API key (free 120B model)
- **Automatic Fetching**: Accept Jira issue ID and automatically fetch issue details
- **Test Plan Generation**: Use GROQ AI to generate comprehensive test plans
- **Output Delivery**: Save markdown file and provide clipboard copy functionality
- **UI Framework**: React with TypeScript and TailwindCSS

### BLAST Framework Implementation Status

#### ✅ Phase 0: Initialization
- Project memory created: `task_plan.md`, `findings.md`, `progress.md`, `gemini.md`
- Data schema defined in `gemini.md`
- Discovery questions answered and documented
- Implementation blocked until schema was confirmed

#### ✅ Phase 1: Blueprint
- **North Star**: Automatically fetch Jira issue → Generate markdown test plan
- **Integrations**: Jira REST API + GROQ API (openai/gpt-oss-120b)
- **Source of Truth**: Jira issue fields only (summary, description, acceptance criteria, labels, components, priority, etc.)
- **Delivery Payload**: Markdown file saved to workspace + clipboard copy
- **Behavioral Rules**: Output only test plan sections, no hallucination, deterministic

#### ✅ Phase 2: Link (Connectivity)
- Created SOPs for all API connections in `architecture/` folder
- Jira Integration SOP: `01_JIRA_INTEGRATION.md`
- GROQ Integration SOP: `02_GROQ_INTEGRATION.md`
- React App Flow SOP: `03_REACT_APP_FLOW.md`
- File Operations SOP: `04_FILE_OPERATIONS.md`

#### ✅ Phase 3: Architect (3-Layer Build)
- **Layer 1 (Architecture)**: SOPs in `architecture/` folder define all business logic
- **Layer 2 (Navigation)**: React components route data between UI and services
- **Layer 3 (Tools)**: Deterministic service files in `src/services/`
  - `jiraService.ts`: Atomic Jira API calls with retry logic
  - `groqService.ts`: Atomic GROQ API calls with prompt engineering
  - `fileService.ts`: File download and clipboard operations
  - `settingsStore.ts`: Zustand state management

#### ✅ Phase 4: Stylize (UI/UX)
- React components with TailwindCSS styling
  - `SettingsPanel.tsx`: Secure credentials configuration
  - `TestPlanGenerator.tsx`: Main workflow UI
  - `App.tsx`: Tab navigation and layout
- Professional UI/UX with loading states, error handling, and feedback
- Responsive design with gradient background
- Copy to clipboard and download functionality

#### ✅ Phase 5: Trigger (Deployment)
- Project ready for deployment (see README_APP.md for instructions)
- Next: Test with real credentials, deploy to cloud, set up CI/CD

### Technology Stack
- **Frontend**: React 18 + TypeScript
- **Build**: Vite (fast development and optimized builds)
- **Styling**: TailwindCSS + PostCSS
- **State Management**: Zustand (lightweight)
- **HTTP Client**: Axios
- **LLM Provider**: GROQ API (openai/gpt-oss-120b - Free)

### Project Structure
```
Chapter03_BLAST_FW/
├── src/
│   ├── components/
│   │   ├── SettingsPanel.tsx
│   │   └── TestPlanGenerator.tsx
│   ├── services/
│   │   ├── jiraService.ts
│   │   ├── groqService.ts
│   │   └── fileService.ts
│   ├── store/
│   │   └── settingsStore.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── architecture/
│   ├── 01_JIRA_INTEGRATION.md
│   ├── 02_GROQ_INTEGRATION.md
│   ├── 03_REACT_APP_FLOW.md
│   └── 04_FILE_OPERATIONS.md
├── tools/                      # Reserved for scripts
├── .tmp/                       # Temporary workspace
├── test-plans/                 # Output directory
├── .env                        # Environment variables
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── gemini.md                   # Project Constitution
├── task_plan.md                # Task tracking
├── progress.md                 # Progress tracking
├── findings.md                 # Discoveries and constraints
└── README_APP.md               # Application documentation
```

### Features Implemented
1. ✅ **Settings Management**: Secure storage of Jira and GROQ credentials in localStorage
2. ✅ **Jira Integration**: Fetch issues by ID using REST API with Basic Auth
3. ✅ **AI Test Plan Generation**: Use GROQ API with intelligent prompting
4. ✅ **File Operations**: Download markdown and copy to clipboard
5. ✅ **Error Handling**: User-friendly error messages and retry logic
6. ✅ **Loading States**: Visual feedback during API calls
7. ✅ **Responsive UI**: Clean design with TailwindCSS
8. ✅ **Tab Navigation**: Settings and Generator tabs

### How to Use
1. Open application (`npm run dev`)
2. Go to **Settings** tab and enter:
   - Jira Base URL (e.g., https://your-domain.atlassian.net)
   - Jira Email
   - Jira API Token
   - GROQ API Key
3. Go to **Test Plan Generator** tab
4. Enter Jira Issue ID (e.g., KAN-12)
5. Click **Fetch Issue** to retrieve details
6. Click **Generate Test Plan** to create test plan
7. Download or copy the generated markdown

### Environment Variables (.env)
```
GROQ_KEY=your_groq_api_key
JIRA_EMAIL=your_jira_email
JIRA_TOKEN=your_jira_api_token
JIRA_URL=https://your-domain.atlassian.net
```

### Installation & Running
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### BLAST Framework Compliance
✅ **Initialization**: Project memory created and maintained
✅ **Blueprint**: Clear vision, logic, and discovery answers
✅ **Link**: Architecture SOPs define all connectivity
✅ **Architect**: 3-layer architecture implemented (SOPs → Navigation → Tools)
✅ **Stylize**: Professional UI/UX with error handling
✅ **Trigger**: Ready for cloud deployment

### Delivery Payload
The application generates:
- **Markdown Test Plan** with sections:
  - Test Scope
  - Test Strategy
  - Test Cases (with steps and expected results)
  - Test Data Requirements
  - Environment Setup
  - Success Criteria
  - Assumptions and Risks
- **Output Formats**: Download file (.md) or copy to clipboard
- **Metadata**: Issue ID, timestamp, LLM model version

### Next Steps (Phase 5 - Trigger)
1. Test with real Jira and GROQ credentials
2. Deploy to cloud platform (Vercel, Netlify, or GitHub Pages)
3. Set up CI/CD pipeline
4. Create production maintenance log
5. Document learnings and edge cases

### Status
🟢 **COMPLETE** - Ready for Phase 5 deployment and testing