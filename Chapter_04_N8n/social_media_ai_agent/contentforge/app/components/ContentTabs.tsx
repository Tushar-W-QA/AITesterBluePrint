"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ContentRow } from "@/lib/types";
import { useTheme } from "@/app/context/ThemeContext";

interface ContentTabsProps {
  row: ContentRow | null;
}

const TABS = [
  { key: "linkedinPost", label: "LinkedIn" },
  { key: "mediumArticle", label: "Medium" },
  { key: "igScript", label: "Instagram" },
  { key: "ytScript", label: "YouTube" },
  { key: "devtoArticle", label: "Dev.to" },
] as const;

const IMAGE_PROMPTS = [
  { key: "mediumImagePrompt", label: "Medium Cover (16:9)" },
  { key: "linkedinImagePrompt", label: "LinkedIn Image (1200×627)" },
  { key: "igImagePrompt", label: "Instagram (1080×1080)" },
] as const;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="text-xs px-3 py-1 rounded-md transition-colors"
      style={{
        backgroundColor: "var(--app-card)",
        color: "var(--app-subtle)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--app-border)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--app-card)"; }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function isMarkdown(key: string) {
  return key === "mediumArticle" || key === "devtoArticle";
}

export default function ContentTabs({ row }: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<string>("linkedinPost");
  const { theme } = useTheme();

  if (!row) {
    return (
      <div
        className="border rounded-xl p-8 text-center text-app-muted"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        No content generated yet for today. Run the pipeline to get started.
      </div>
    );
  }

  const activeContent = row[activeTab as keyof ContentRow] as string;

  return (
    <div className="space-y-6">
      <div
        className="border rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <div className="flex overflow-x-auto border-b" style={{ borderColor: "var(--app-border)" }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors"
              style={
                activeTab === tab.key
                  ? { color: "var(--app-accent)", borderBottom: "2px solid var(--app-accent)", backgroundColor: "var(--app-card)" }
                  : { color: "var(--app-muted)" }
              }
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) (e.currentTarget as HTMLElement).style.color = "var(--app-subtle)";
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) (e.currentTarget as HTMLElement).style.color = "var(--app-muted)";
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          <div className="flex justify-end mb-2">
            <CopyButton text={activeContent} />
          </div>
          {activeContent ? (
            isMarkdown(activeTab) ? (
              <div className={`prose ${theme === "dark" ? "prose-invert" : ""} prose-sm max-w-none`}>
                <ReactMarkdown>{activeContent}</ReactMarkdown>
              </div>
            ) : (
              <pre
                className="whitespace-pre-wrap text-sm leading-relaxed"
                style={{ color: "var(--app-subtle)" }}
              >
                {activeContent}
              </pre>
            )
          ) : (
            <p className="text-app-muted text-sm">Content not yet generated.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-app-muted uppercase tracking-wider mb-3">Image Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {IMAGE_PROMPTS.map((p) => {
            const content = row[p.key as keyof ContentRow] as string;
            return (
              <div
                key={p.key}
                className="border rounded-xl p-4"
                style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold" style={{ color: "var(--app-accent)" }}>{p.label}</span>
                  {content && <CopyButton text={content} />}
                </div>
                {content ? (
                  <p className="text-xs text-app-subtle leading-relaxed">{content}</p>
                ) : (
                  <p className="text-xs text-app-muted">Not generated yet.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
