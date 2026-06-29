"use client";

import type { ContentRow } from "@/lib/types";

interface CalendarTableProps {
  rows: ContentRow[];
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-600",
  Writing: "bg-blue-500/20 text-blue-600",
  Prompting: "bg-purple-500/20 text-purple-600",
  Done: "bg-green-500/20 text-green-600",
  Error: "bg-red-500/20 text-red-600",
};

function truncate(s: string, n = 60) {
  if (!s) return "—";
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export default function CalendarTable({ rows }: CalendarTableProps) {
  if (!rows.length) {
    return <p className="text-app-muted text-sm text-center py-8">No rows yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--app-border)" }}>
      <table className="min-w-full text-sm">
        <thead>
          <tr
            className="text-xs uppercase tracking-wider"
            style={{ backgroundColor: "var(--app-surface)", color: "var(--app-muted)" }}
          >
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Topic</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">LinkedIn</th>
            <th className="px-4 py-3 text-left">Medium</th>
            <th className="px-4 py-3 text-left">Last Updated</th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: "var(--app-border)" }}
        >
          {rows.map((row) => (
            <tr
              key={row.date}
              className="transition-colors"
              style={{ backgroundColor: "var(--app-bg)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--app-surface)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--app-bg)"; }}
            >
              <td className="px-4 py-3 font-mono text-app-subtle">{row.date}</td>
              <td className="px-4 py-3 text-app-text font-medium max-w-xs">{row.topic}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[row.status] ?? "bg-gray-500/20 text-gray-500"}`}>
                  {row.status}
                </span>
              </td>
              <td className="px-4 py-3 text-app-muted max-w-xs">{truncate(row.linkedinPost)}</td>
              <td className="px-4 py-3 text-app-muted max-w-xs">{truncate(row.mediumArticle)}</td>
              <td className="px-4 py-3 text-app-muted text-xs font-mono">
                {row.lastUpdated ? new Date(row.lastUpdated).toLocaleString() : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
