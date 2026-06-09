# BLAST Task Plan

## Objective
Create a lightweight React-based application that automatically fetches Jira issues and generates comprehensive test plans using GROQ AI (openai/gpt-oss-120b free tier).

## Scope
- Input: Jira ID, Jira credentials (email, base URL, token), GROQ API key
- Source of truth: Jira issue fields only
- Output: Markdown test plan file saved to workspace + clipboard copy
- Behavioral rule: Output only test plan sections, no hallucination

## Goals
1. ✅ Phase 0: Initialize project memory and discovery
2. ✅ Phase 1: Define blueprint and data schema
3. ✅ Phase 2: Create architecture SOPs for API connectivity
4. ✅ Phase 3: Build 3-layer architecture with React components and services
5. ✅ Phase 4: Stylize UI with TailwindCSS and responsive design
6. 📋 Phase 5: Deploy and set up CI/CD automation

## Checklist - Phase 0/1 (Complete)
- [x] Confirm discovery questions and user intent
- [x] Confirm required Jira fields
- [x] Define input/output JSON schema in `gemini.md`
- [x] Create `task_plan.md`, `findings.md`, `progress.md`, and `gemini.md`
- [x] Update `gemini.md` with technology stack and integration details

## Checklist - Phase 2 (Complete)
- [x] Create Jira API integration SOP
- [x] Create GROQ API integration SOP
- [x] Create React app flow SOP
- [x] Create file operations SOP
- [x] All SOPs documented in `architecture/` folder

## Checklist - Phase 3 (Complete)
- [x] Layer 1 (Architecture): All SOPs created
- [x] Layer 2 (Navigation): React app structure with routing
- [x] Layer 3 (Tools): All service files created
  - [x] `jiraService.ts` - Jira API integration
  - [x] `groqService.ts` - GROQ LLM integration
  - [x] `fileService.ts` - File operations
  - [x] `settingsStore.ts` - State management
- [x] Type definitions in `types/index.ts`

## Checklist - Phase 4 (Complete)
- [x] Create Settings Panel component
- [x] Create Test Plan Generator component
- [x] Create main App component with tabs
- [x] Apply TailwindCSS styling
- [x] Implement error handling and loading states
- [x] Create responsive UI design
- [x] Add copy to clipboard functionality
- [x] Add file download functionality

## Checklist - Project Setup (Complete)
- [x] Create `package.json` with dependencies
- [x] Create TypeScript configuration
- [x] Create Vite configuration
- [x] Create TailwindCSS configuration
- [x] Create PostCSS configuration
- [x] Create `index.html` entry point
- [x] Create CSS base file with Tailwind
- [x] Create project directories structure
- [x] Create comprehensive documentation

## Implementation Phases

### Phase 0: ✅ Initialization
- Discovery questions: ANSWERED
- Schema definition: CREATED in `gemini.md`
- Memory files: CREATED

### Phase 1: ✅ Blueprint
- North Star: Jira issue → Auto test plan generation
- Integrations: Jira API + GROQ API
- Source: Jira fields only
- Delivery: Markdown file + clipboard
- Rules: Test plan sections only

### Phase 2: ✅ Link (Connectivity)
- Architecture SOPs created for all integrations
- Ready for API testing

### Phase 3: ✅ Architect (3-Layer Build)
- Layer 1: SOPs in `architecture/` folder
- Layer 2: Navigation in React components
- Layer 3: Deterministic services in `src/services/`

### Phase 4: ✅ Stylize (UI/UX)
- TailwindCSS styling applied
- Responsive design implemented
- Professional UI/UX

### Phase 5: 📋 Trigger (Deployment)
- **TODO**: Test with real Jira and GROQ credentials
- **TODO**: Deploy to cloud (Vercel/Netlify)
- **TODO**: Set up CI/CD pipeline
- **TODO**: Create maintenance log

## Technology Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS + PostCSS
- **State**: Zustand
- **HTTP**: Axios
- **LLM**: GROQ API (openai/gpt-oss-120b)

## Project Structure
```
Chapter03_BLAST_FW/
├── src/
│   ├── components/          # React UI components
│   ├── services/            # API integrations
│   ├── store/               # State management
│   ├── types/               # TypeScript types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── architecture/            # Layer 1 SOPs
├── tools/                   # Layer 3 scripts (reserved)
├── .tmp/                    # Temporary files
├── test-plans/              # Output directory
├── .env                     # Credentials
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── gemini.md                # Project Constitution
├── task_plan.md             # This file
├── progress.md
├── findings.md
└── README_APP.md
```

## Running the Application

### Development
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

## Environment Variables (.env)
```
GROQ_KEY=<your_groq_api_key>
JIRA_EMAIL=<your_jira_email>
JIRA_TOKEN=<your_jira_api_token>
JIRA_URL=<https://your-domain.atlassian.net>
```

## Key Features Implemented
1. ✅ Secure settings management (localStorage)
2. ✅ Jira issue fetching via REST API
3. ✅ AI-powered test plan generation
4. ✅ Markdown download and clipboard copy
5. ✅ Loading states and error handling
6. ✅ Responsive design
7. ✅ Tab-based navigation (Generator + Settings)

## Notes
- All API calls are made from the browser (no backend required)
- Settings stored in localStorage (can be cleared)
- Credentials never sent to external servers except Jira and GROQ
- Project follows BLAST framework for reliability and determinism
