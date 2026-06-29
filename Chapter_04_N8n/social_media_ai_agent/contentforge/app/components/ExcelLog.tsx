"use client";

interface ExcelLogProps {
  stats: { path: string; modified: string; rowCount: number } | null;
}

export default function ExcelLog({ stats }: ExcelLogProps) {
  const download = () => {
    window.open("/api/download", "_blank");
  };

  return (
    <div className="space-y-4">
      <div
        className="border rounded-xl p-6 space-y-3"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-app-subtle">Excel File Details</h3>
          <button
            onClick={download}
            className="px-4 py-1.5 bg-app-accent hover:bg-app-accent-hover text-white text-sm rounded-lg transition-colors"
          >
            Download .xlsx
          </button>
        </div>
        {stats ? (
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <dt className="text-xs text-app-muted uppercase tracking-wider mb-1">File Path</dt>
              <dd className="text-sm font-mono text-app-subtle break-all">{stats.path || "content_calendar.xlsx"}</dd>
            </div>
            <div>
              <dt className="text-xs text-app-muted uppercase tracking-wider mb-1">Last Modified</dt>
              <dd className="text-sm text-app-subtle">{stats.modified ? new Date(stats.modified).toLocaleString() : "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-app-muted uppercase tracking-wider mb-1">Total Rows</dt>
              <dd className="text-2xl font-bold" style={{ color: "var(--app-accent)" }}>{stats.rowCount}</dd>
            </div>
          </dl>
        ) : (
          <p className="text-app-muted text-sm">Loading file info...</p>
        )}
      </div>

      <div
        className="border rounded-xl p-6"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <h3 className="text-sm font-semibold text-app-subtle mb-3">Write Log (by agent)</h3>
        <ul className="space-y-2 text-sm text-app-muted">
          <li className="flex gap-2">
            <span className="text-yellow-500 font-mono">Agent 1</span>
            → Appends: Date, Topic, Status=&quot;Pending&quot;
          </li>
          <li className="flex gap-2">
            <span className="text-blue-500 font-mono">Agent 2</span>
            → Writes: LinkedIn POST, Medium Article, IG Script, YT Script, Dev.to Article → Status=&quot;Prompting&quot;
          </li>
          <li className="flex gap-2">
            <span className="text-purple-500 font-mono">Agent 3</span>
            → Writes: LinkedIn/Medium/IG Image Prompts → Status=&quot;Done&quot; or &quot;Error&quot;
          </li>
          <li className="flex gap-2">
            <span className="font-mono" style={{ color: "var(--app-muted)" }}>All agents</span>
            → Update Last Updated timestamp on every write
          </li>
        </ul>
      </div>
    </div>
  );
}
