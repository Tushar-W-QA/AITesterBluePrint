# ContentForge — AI Content Pipeline

A local, fully automated content-generation dashboard built for **Tushar Warad** — 7 years in software automation testing, actively exploring AI in QA.

Runs entirely on your machine. One Groq API key. No subscriptions, no cloud infra.

---

## Quick Start

```bash
cd contentforge
cp .env.example .env.local
# Edit .env.local — add your GROQ_API_KEY
npm install
npm run dev
```

Open **http://localhost:3000**

---

## Environment Variables (`.env.local`)

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | Yes | From console.groq.com |
| `GOOGLE_SHEET_ID` | Optional | Your Google Sheet ID (from the URL) |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Optional | Full JSON of your service account key (single line) |
| `GOOGLE_SHARE_EMAIL` | Optional | Email to auto-share the sheet with (defaults to your Gmail) |

---

## Architecture Overview

```
contentforge/
├── lib/
│   ├── types.ts               # ContentRow interface, ContentStatus enum, KEYWORD_POOL
│   ├── persona.ts             # Tushar Warad's voice, background, writing rules
│   ├── excelManager.ts        # Mutex-safe read/write to content_calendar.xlsx
│   ├── googleSheetsManager.ts # Auto-create + auto-share Google Sheet via service account
│   ├── agents.ts              # Agent 1, 2, 3 logic + Groq API calls
│   ├── pipeline.ts            # Orchestration: auto run + manual topic run
│   ├── scheduler.ts           # node-cron: fires at 09:00 daily
│   └── utils.ts               # getNextRun() utility
├── app/
│   ├── page.tsx               # Main dashboard (4 tabs)
│   ├── layout.tsx
│   ├── globals.css
│   ├── components/
│   │   ├── ManualGenerate.tsx  # Manual input tab with topic form + suggested topics
│   │   ├── StatusCards.tsx     # Today's topic, pipeline status, last updated
│   │   ├── ContentTabs.tsx     # LinkedIn/Medium/IG/YouTube/Dev.to + image prompts
│   │   ├── CalendarTable.tsx   # Full content calendar, newest first
│   │   └── ExcelLog.tsx        # Excel file info + download button
│   └── api/
│       ├── run/route.ts        # POST — trigger auto pipeline (AI picks topic)
│       ├── run-manual/route.ts # POST { topic } — trigger pipeline with your topic
│       ├── today/route.ts      # GET — today's row
│       ├── calendar/route.ts   # GET — all rows
│       ├── status/route.ts     # GET — pipeline state, Groq health, sheet URL
│       ├── download/route.ts   # GET — download content_calendar.xlsx
│       └── sync-sheets/route.ts# POST — sync all Excel rows → Google Sheets
├── instrumentation.ts          # Starts node-cron scheduler on server boot (once)
├── content_calendar.xlsx       # Auto-created on first run
└── .sheets-id-cache            # Persists the auto-created Google Sheet ID
```

---

## The Four Agents

### Agent 1 — Topic Generator
Runs automatically at **09:00 AM daily** (node-cron) or when you click **Auto Run**.
- Picks one keyword from the pool: `QA, MCP, RAG, LLM, AI Agents, n8n, LangFlow, Crew AI, DeepEval, LangChain, AI Harness, LLM Eval`
- Avoids topics already in the sheet
- Writes: Date, Topic, Status = Pending

### Agent 2 — Content Writer (Groq LLaMA 3.3 70B)
Generates **5 platform-specific pieces in parallel**:

| Platform | Format | Length |
|---|---|---|
| LinkedIn | Hook-driven post, bullet points, CTA question, hashtags | 150–200 words |
| Medium | Full markdown article with H2 sections + code blocks | ~3000 words |
| Instagram | Carousel slides + 60-sec Reel voiceover + caption | — |
| YouTube | Timestamped script with B-roll notes + outro | ~18 min |
| Dev.to | Technical article with frontmatter + code examples | ~2000 words |

All written in **Tushar Warad's voice** — peer-to-peer, no filler, real tool references.
Sets Status = Prompting when done.

### Agent 3 — Image Prompt Generator (Groq)
Generates **3 ready-to-paste image prompts** (no actual images are produced):

| Prompt | Dimensions | Use |
|---|---|---|
| Medium cover | 16:9 aspect ratio | Paste into Midjourney / DALL-E 3 |
| LinkedIn banner | 1200×627 px | Paste into Midjourney / DALL-E 3 |
| Instagram square | 1080×1080 px | Paste into Midjourney / DALL-E 3 |

**No brand names, no logos, no text overlays** — purely visual prompts describing the topic concept through abstract/technical imagery (dark background, electric blue/cyan accents).
Sets Status = Done on success, Error on failure.

### Agent 4 — Sheet Updater (built-in)
Every agent writes results directly back to `content_calendar.xlsx` after each step via `ExcelManager` — a mutex-locked class that prevents file corruption under concurrent writes.

---

## Dashboard Tabs

### Generate (default — opens here)
- **Type any topic** in the textarea → click **Generate All Content**
- `Ctrl+Enter` keyboard shortcut
- 10 pre-filled suggested topics (click any to fill the textarea instantly)
- Shows what gets generated and step-by-step how the pipeline works
- Automatically switches to Today's Content after generation starts

### Today's Content
- Expandable sections for each platform with **copy-to-clipboard**
- Markdown rendering for Medium and Dev.to articles (headings, code blocks, lists)
- Three image prompt cards with copy-to-clipboard on each
- Live updates every 4 seconds while pipeline is running

### Calendar
- Full `content_calendar.xlsx` displayed as a table, newest first
- Colour-coded Status column: Pending (yellow) / Writing (blue) / Prompting (purple) / Done (green) / Error (red)

### Excel Log
- File path, last modified timestamp, total row count
- **Download .xlsx** button
- Per-agent write log (what each agent writes and when)

---

## Header Controls

| Control | Description |
|---|---|
| **Groq · Connected** (green dot) | API key is valid — checked every 2 min, cached to avoid rate waste |
| **Groq · Disconnected** (red dot) | Key missing or invalid — check `.env.local` |
| **Open Sheet ↗** | Clickable link to the Google Sheet (appears after first sync) |
| **Sheets not configured** (yellow dot) | Add `GOOGLE_SERVICE_ACCOUNT_JSON` to `.env.local` |
| **Sync → Sheets** | Push all Excel rows to Google Sheets now |
| **Auto Run** | Run Agent 1 → 2 → 3 (AI chooses today's topic) |
| Progress bar | Animated while any pipeline step is active |

---

## API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/run` | Trigger auto pipeline (AI picks topic) |
| `POST` | `/api/run-manual` | `{ topic: string }` — run with your topic |
| `GET` | `/api/today` | Today's row as JSON |
| `GET` | `/api/calendar` | All rows as JSON |
| `GET` | `/api/status` | Pipeline state + Groq health + sheet URL |
| `GET` | `/api/download` | Download `content_calendar.xlsx` |
| `POST` | `/api/sync-sheets` | Sync all rows to Google Sheets |

---

## Google Sheets Integration (Optional)

### Setup (~5 minutes, one-time)

1. [Google Cloud Console](https://console.cloud.google.com) → Create / select a project
2. Enable **Google Sheets API** and **Google Drive API**
3. IAM & Admin → Service Accounts → Create → Keys tab → Add Key → JSON → Download
4. Open the JSON file, copy its entire contents (compact it to one line if needed)
5. Paste into `.env.local` as `GOOGLE_SERVICE_ACCOUNT_JSON=<paste here>`
6. Restart the dev server

**What happens automatically on first sync:**
- App creates a new "ContentForge — Content Calendar" sheet owned by the service account
- Shares it with your Gmail (read/write access)
- Writes bold, formatted headers
- Syncs all rows from Excel
- Caches the sheet ID in `.sheets-id-cache` — reused on every restart
- Dashboard shows a live **"Open Sheet ↗"** link

After every pipeline run (if credentials are set) and every manual Sync click, the sheet updates automatically.

---

## Data Model

File: `content_calendar.xlsx` (auto-created in `contentforge/` on first run)

| Column | Description |
|---|---|
| Date | ISO date YYYY-MM-DD |
| Topic | Article / post topic |
| LinkedIn POST | Full post text |
| Medium Article | Full markdown article |
| IG Script | Carousel slides + Reel voiceover + caption |
| YT Script | Timestamped YouTube video script |
| Dev.to Article | Markdown article with frontmatter |
| Status | Pending → Writing → Prompting → Done / Error |
| LinkedIn Image Prompt | Ready-to-paste prompt (1200×627) |
| Medium Image Prompt | Ready-to-paste prompt (16:9) |
| IG Image Prompt | Ready-to-paste prompt (1080×1080) |
| Last Updated | ISO datetime of last write |
| Error Message | Details if Status = Error |

---

## Scheduling

Scheduler starts automatically when the dev server boots (`instrumentation.ts`).
Fires at **09:00 AM local time** every day.

To change the time, edit `lib/scheduler.ts`:
```ts
cron.schedule("0 9 * * *", ...) // standard cron — "0 8 * * 1-5" = 8am weekdays only
```

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| UI | React 18 + Tailwind CSS |
| LLM / Text gen | Groq — `llama-3.3-70b-versatile` |
| Excel | ExcelJS |
| Cron scheduler | node-cron |
| Sheets API | googleapis + google-auth-library |
| Concurrency lock | async-mutex |
| Markdown render | react-markdown |

---

## Persona — Tushar Warad

All generated content writes as **Tushar Warad**:
- 7 years in software automation testing
- Actively exploring AI in QA: LLMs, AI agents, AI-assisted test generation
- Voice: direct, peer-to-peer, no filler — a practitioner, not an influencer
- Tools referenced: Playwright, Selenium, LangChain, n8n, Groq, DeepEval, LangFlow, Crew AI, RAG, MCP

To update the persona, edit [`lib/persona.ts`](lib/persona.ts).

---

## Notes

- **Idempotent per day** — re-running skips agents whose output already exists. Delete the row or change the date to regenerate.
- **Google Sheets is optional** — the app works fully without it (Excel + dashboard only).
- **Image prompts are text only** — paste them into Midjourney, DALL-E 3, Gemini, or any generator. No images are produced by the app.
- **Groq rate limits** — Agent 2 fires 5 parallel requests. If you hit a limit, Status = Error. Re-run; it skips already-written fields.
