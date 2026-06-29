export type ContentStatus = "Pending" | "Writing" | "Prompting" | "Done" | "Error";

export interface ContentRow {
  date: string;           // ISO date string YYYY-MM-DD
  topic: string;
  linkedinPost: string;
  mediumArticle: string;
  igScript: string;
  ytScript: string;
  devtoArticle: string;
  status: ContentStatus;
  linkedinImagePrompt: string;
  mediumImagePrompt: string;
  igImagePrompt: string;
  lastUpdated?: string;   // ISO datetime string
  errorMessage?: string;
}

export interface PipelineStatus {
  running: boolean;
  currentStep: string;
  lastRun: string | null;
  nextRun: string;
  groqKeyValid: boolean;
}

export const KEYWORD_POOL = [
  "QA", "MCP", "RAG", "LLM", "AI Agents", "n8n", "LangFlow",
  "Crew AI", "DeepEval", "LangChain", "AI Harness", "LLM Eval",
] as const;

export const EXCEL_COLUMNS = [
  "Date", "Topic", "LinkedIn POST", "Medium Article", "IG Script",
  "YT Script", "Dev.to Article", "Status", "LinkedIn Image Prompt",
  "Medium Image Prompt", "IG Image Prompt", "Last Updated", "Error Message",
] as const;
