"use client";

import { useState } from "react";
import { useTheme, type Theme } from "@/app/context/ThemeContext";

const THEMES: { id: Theme; label: string; bg: string; ring: string }[] = [
  { id: "dark",    label: "Dark",    bg: "#030712", ring: "#374151" },
  { id: "white",   label: "White",   bg: "#f8fafc", ring: "#cbd5e1" },
  { id: "grey",    label: "Grey",    bg: "#e5e7eb", ring: "#9ca3af" },
  { id: "natural", label: "Natural", bg: "#faf6ee", ring: "#c4a882" },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const current = THEMES.find((t) => t.id === theme)!;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Switch theme"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-colors"
        style={{
          backgroundColor: "var(--app-card)",
          borderColor: "var(--app-border)",
          color: "var(--app-muted)",
        }}
      >
        <span
          className="h-3 w-3 rounded-sm border"
          style={{ background: current.bg, borderColor: current.ring }}
        />
        <span style={{ color: "var(--app-subtle)" }}>{current.label}</span>
        <span style={{ color: "var(--app-muted)" }}>▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1.5 z-20 rounded-xl shadow-xl p-1.5 min-w-[148px] border"
            style={{
              backgroundColor: "var(--app-surface)",
              borderColor: "var(--app-border)",
            }}
          >
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: theme === t.id ? "var(--app-card)" : "transparent",
                  color: theme === t.id ? "var(--app-text)" : "var(--app-muted)",
                }}
                onMouseEnter={(e) => {
                  if (theme !== t.id) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--app-card)";
                }}
                onMouseLeave={(e) => {
                  if (theme !== t.id) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <span
                  className="h-4 w-4 rounded flex-shrink-0 border"
                  style={{ background: t.bg, borderColor: t.ring }}
                />
                {t.label}
                {theme === t.id && (
                  <span className="ml-auto text-xs" style={{ color: "var(--app-accent)" }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
