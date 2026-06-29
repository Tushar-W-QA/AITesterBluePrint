"use client";

import { useState } from "react";

interface ManualGenerateProps {
  pipelineRunning: boolean;
  onStarted: (topic: string) => void;
}

const SUGGESTED_TOPICS = [
  "How to build an AI-powered test framework with LangChain",
  "RAG-based test data generation for automation testing",
  "Using MCP in QA workflows for smarter test execution",
  "LLM evaluation with DeepEval: a practical guide for SDETs",
  "n8n automation for QA: building no-code test pipelines",
  "AI Agents in Selenium testing: what actually works in 2025",
  "Playwright vs Selenium in 2025: a 7-year tester's honest take",
  "LangFlow for test orchestration: zero-code AI test pipelines",
  "Crew AI multi-agent systems for end-to-end QA automation",
  "AI Harness patterns for reliable LLM testing in production",
];

const STEPS = [
  { id: "linkedin",  label: "LinkedIn Post",   color: "bg-blue-500" },
  { id: "medium",    label: "Medium Article",  color: "bg-green-500" },
  { id: "instagram", label: "IG Script",       color: "bg-pink-500" },
  { id: "youtube",   label: "YouTube Script",  color: "bg-red-500" },
  { id: "devto",     label: "Dev.to Article",  color: "bg-purple-500" },
  { id: "images",    label: "Image Prompts",   color: "bg-yellow-500" },
];

export default function ManualGenerate({ pipelineRunning, onStarted }: ManualGenerateProps) {
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const trimmed = topic.trim();
    if (!trimmed) {
      setError("Please enter a topic before generating.");
      return;
    }
    if (trimmed.length < 5) {
      setError("Topic is too short. Add a bit more detail.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/run-manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: trimmed }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setSuccess(data.message ?? "Pipeline started!");
        onStarted(trimmed);
      }
    } catch {
      setError("Failed to reach the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleGenerate();
  };

  return (
    <div className="space-y-6">

      {/* Main input card */}
      <div
        className="border rounded-2xl p-6 space-y-4"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <div>
          <label className="block text-sm font-semibold text-app-subtle mb-2">
            Your Topic
          </label>
          <textarea
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setError(""); setSuccess(""); }}
            onKeyDown={handleKeyDown}
            disabled={pipelineRunning || loading}
            placeholder="e.g. How AI agents are changing software automation testing in 2025"
            rows={3}
            className="w-full border rounded-xl px-4 py-3 text-sm resize-none outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--app-input)",
              borderColor: "var(--app-input-b)",
              color: "var(--app-text)",
            }}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--app-accent)"; }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--app-input-b)"; }}
          />
          <p className="mt-1.5 text-xs text-app-muted">
            Tip: Be specific. A focused topic produces better content. Press Ctrl+Enter to generate.
          </p>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
            <span className="text-red-500">✕</span> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
            <span className="text-emerald-600">✓</span> {success} — watch the status cards above update live.
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={pipelineRunning || loading || !topic.trim()}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all bg-app-accent hover:bg-app-accent-hover active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg"
        >
          {pipelineRunning
            ? "Pipeline is running… check the status cards above"
            : loading
            ? "Starting pipeline…"
            : "Generate All Content for This Topic"}
        </button>
      </div>

      {/* What gets generated */}
      <div
        className="border rounded-2xl p-6"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <h3 className="text-sm font-semibold text-app-subtle mb-4">What gets generated</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5"
              style={{ backgroundColor: "var(--app-card)" }}
            >
              <span className={`h-2 w-2 rounded-full flex-shrink-0 ${step.color}`} />
              <span className="text-sm text-app-subtle">{step.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-app-muted">
          All content is written in{" "}
          <span className="font-medium" style={{ color: "var(--app-accent)" }}>Tushar Warad&apos;s voice</span> —
          7 years of automation testing expertise + AI in QA perspective.
        </p>
      </div>

      {/* Suggested topics */}
      <div
        className="border rounded-2xl p-6"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <h3 className="text-sm font-semibold text-app-subtle mb-3">Suggested topics — click to use</h3>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => { setTopic(t); setError(""); setSuccess(""); }}
              disabled={pipelineRunning || loading}
              className="text-xs px-3 py-1.5 rounded-full border text-app-muted transition-all truncate max-w-full disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: "var(--app-border)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--app-accent)";
                (e.currentTarget as HTMLElement).style.color = "var(--app-accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--app-border)";
                (e.currentTarget as HTMLElement).style.color = "var(--app-muted)";
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div
        className="border rounded-2xl p-6"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <h3 className="text-sm font-semibold text-app-subtle mb-4">How it works</h3>
        <ol className="space-y-3">
          {[
            { n: "1", label: "You type a topic", desc: "Any topic related to testing, AI, or automation." },
            { n: "2", label: "Agent 2 writes 5 pieces", desc: "LinkedIn post, Medium article, IG script, YouTube script, Dev.to article — all in your voice." },
            { n: "3", label: "Agent 3 creates image prompts", desc: "3 ready-to-paste prompts for Midjourney or DALL-E (LinkedIn, Medium, Instagram sizes)." },
            { n: "4", label: "Saved to Excel + Google Sheets", desc: "Content is written to content_calendar.xlsx and synced to your Google Sheet automatically." },
            { n: "5", label: "View in Today's Content tab", desc: "Switch to the Today's Content tab to read, copy, or download everything." },
          ].map((s) => (
            <li key={s.n} className="flex items-start gap-3">
              <span
                className="flex-shrink-0 h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center border"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--app-accent) 15%, transparent)",
                  borderColor: "color-mix(in srgb, var(--app-accent) 40%, transparent)",
                  color: "var(--app-accent)",
                }}
              >
                {s.n}
              </span>
              <div>
                <p className="text-sm font-medium text-app-subtle">{s.label}</p>
                <p className="text-xs text-app-muted">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
