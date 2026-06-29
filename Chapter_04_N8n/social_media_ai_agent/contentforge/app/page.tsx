"use client";

import { useState, useEffect, useCallback } from "react";
import StatusCards from "./components/StatusCards";
import ContentTabs from "./components/ContentTabs";
import CalendarTable from "./components/CalendarTable";
import ExcelLog from "./components/ExcelLog";
import ManualGenerate from "./components/ManualGenerate";
import ThemeToggle from "./components/ThemeToggle";
import type { ContentRow } from "@/lib/types";

type Tab = "generate" | "today" | "calendar" | "log";

interface StatusData {
  running: boolean;
  currentStep: string;
  lastRun: string | null;
  nextRun: string;
  groqKeyValid: boolean;
  sheetsConfigured: boolean;
  sheetUrl: string | null;
  currentTopic: string | null;
}

interface ExcelStats {
  path: string;
  modified: string;
  rowCount: number;
}

function Dot({ on, pulse }: { on: boolean | undefined; pulse?: boolean }) {
  if (on === undefined)
    return <span className="h-2 w-2 rounded-full bg-app-muted animate-pulse inline-block" />;
  return (
    <span
      className={`h-2 w-2 rounded-full inline-block ${
        on ? "bg-green-400" : pulse ? "bg-red-400 animate-pulse" : "bg-yellow-500"
      }`}
    />
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("generate");
  const [status, setStatus] = useState<StatusData | null>(null);
  const [todayRow, setTodayRow] = useState<ContentRow | null>(null);
  const [calendarRows, setCalendarRows] = useState<ContentRow[]>([]);
  const [excelStats, setExcelStats] = useState<ExcelStats | null>(null);
  const [banner, setBanner] = useState<{ msg: string; isError: boolean } | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);

  const flash = (msg: string, isError = false) => {
    setBanner({ msg, isError });
    setTimeout(() => setBanner(null), 5000);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status");
      if (res.ok) {
        const d = await res.json() as StatusData;
        setStatus(d);
        if (d.sheetUrl) setSheetUrl(d.sheetUrl);
      }
    } catch {}
  }, []);

  const fetchToday = useCallback(async () => {
    try {
      const res = await fetch("/api/today");
      if (res.ok) {
        const d = await res.json() as { row: ContentRow | null };
        setTodayRow(d.row);
      }
    } catch {}
  }, []);

  const fetchCalendar = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar");
      if (res.ok) {
        const d = await res.json() as { rows: ContentRow[] };
        setCalendarRows(d.rows);
        setExcelStats({ path: "", modified: "", rowCount: d.rows.length });
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchToday();
    fetchCalendar();
    const id = setInterval(() => {
      fetchStatus();
      fetchToday();
      if (activeTab === "calendar" || activeTab === "log") fetchCalendar();
    }, 4000);
    return () => clearInterval(id);
  }, [fetchStatus, fetchToday, fetchCalendar, activeTab]);

  const handleRun = async () => {
    setBanner(null);
    try {
      const res = await fetch("/api/run", { method: "POST" });
      flash(
        res.status === 409
          ? "Pipeline is already running."
          : "Auto pipeline started — AI will pick today's topic and generate content."
      );
    } catch {
      flash("Failed to reach the server.", true);
    }
  };

  const handleSyncSheets = async () => {
    setSyncing(true);
    setBanner(null);
    try {
      const res = await fetch("/api/sync-sheets", { method: "POST" });
      const d = await res.json() as { message?: string; error?: string; url?: string };
      if (res.ok) {
        flash(d.message ?? "Synced!");
        if (d.url) setSheetUrl(d.url);
      } else {
        flash(`Sync error: ${d.error ?? "unknown"}`, true);
      }
    } catch {
      flash("Sync request failed.", true);
    } finally {
      setSyncing(false);
    }
  };

  const handleManualStarted = (topic: string) => {
    flash(`Generating content for: "${topic}" — switch to Today's Content to watch it appear.`);
    setTimeout(() => setActiveTab("today"), 2000);
  };

  const TABS: { key: Tab; label: string; badge?: string }[] = [
    { key: "generate", label: "Generate", badge: "NEW" },
    { key: "today", label: "Today's Content" },
    { key: "calendar", label: "Calendar" },
    { key: "log", label: "Excel Log" },
  ];

  return (
    <div className="min-h-screen bg-app-bg">
      {/* ── Header ── */}
      <header
        className="border-b backdrop-blur sticky top-0 z-10"
        style={{
          borderColor: "var(--app-border)",
          backgroundColor: "var(--app-header)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold text-app-text tracking-tight">
              ContentBuddy
            </span>
            <span
              className="hidden sm:block text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "var(--app-card)", color: "var(--app-muted)" }}
            >
              Tushar Warad · AI Content Pipeline
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* Theme switcher */}
            <ThemeToggle />

            {/* Groq */}
            <div className="flex items-center gap-1.5 text-xs text-app-muted">
              <Dot on={status?.groqKeyValid} pulse />
              Groq {status?.groqKeyValid === undefined ? "…" : status.groqKeyValid ? "Connected" : "Disconnected"}
            </div>

            {/* Sheets */}
            <div className="flex items-center gap-1.5 text-xs text-app-muted">
              <Dot on={status?.sheetsConfigured} />
              {status?.sheetsConfigured
                ? sheetUrl
                  ? <a href={sheetUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 underline underline-offset-2">Open Sheet ↗</a>
                  : "Sheets Ready"
                : "Sheets not configured"}
            </div>

            {/* Next auto-run */}
            {status?.nextRun && (
              <span className="hidden lg:block text-xs text-app-muted">
                Auto: {new Date(status.nextRun).toLocaleTimeString()}
              </span>
            )}

            {/* Sync */}
            <button
              onClick={handleSyncSheets}
              disabled={syncing || !status?.sheetsConfigured}
              title={!status?.sheetsConfigured ? "Add GOOGLE_SERVICE_ACCOUNT_JSON to .env.local" : "Push all rows to Google Sheet"}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white"
            >
              {syncing ? "Syncing…" : "Sync → Sheets"}
            </button>

            {/* Auto pipeline */}
            <button
              onClick={handleRun}
              disabled={status?.running}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-app-accent hover:bg-app-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white"
            >
              {status?.running ? "Running…" : "Auto Run"}
            </button>
          </div>
        </div>

        {/* Banner */}
        {banner && (
          <div className={`border-t px-4 py-1.5 text-sm text-center ${banner.isError ? "border-red-800/60 bg-red-950/60 text-red-300" : "border-sky-800/60 bg-sky-950/60 text-sky-300"}`}>
            {banner.msg}
          </div>
        )}

        {/* Progress bar */}
        {status?.running && (
          <div className="h-0.5 bg-app-border">
            <div className="h-full bg-app-accent w-full animate-pulse" />
          </div>
        )}
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* Status cards */}
        <StatusCards
          topic={todayRow?.topic ?? status?.currentTopic ?? null}
          status={todayRow?.status ?? "idle"}
          lastUpdated={todayRow?.lastUpdated ?? ""}
          running={status?.running ?? false}
          currentStep={status?.currentStep ?? "idle"}
        />

        {/* Tabs */}
        <div
          className="flex gap-1 mb-6 border rounded-xl p-1 w-fit"
          style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-app-accent text-white shadow"
                  : "text-app-muted hover:text-app-subtle hover:bg-app-card"
              }`}
            >
              {tab.label}
              {tab.badge && (
                <span className="ml-1.5 text-[10px] font-bold px-1 py-0.5 rounded bg-sky-500 text-white leading-none">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "generate" && (
          <ManualGenerate
            pipelineRunning={status?.running ?? false}
            onStarted={handleManualStarted}
          />
        )}
        {activeTab === "today" && <ContentTabs row={todayRow} />}
        {activeTab === "calendar" && <CalendarTable rows={calendarRows} />}
        {activeTab === "log" && <ExcelLog stats={excelStats} />}
      </main>
    </div>
  );
}
