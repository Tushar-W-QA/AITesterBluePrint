"use client";

interface StatusCardsProps {
  topic: string | null;
  status: string;
  lastUpdated: string;
  running: boolean;
  currentStep: string;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  Writing: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  Prompting: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  Done: "bg-green-500/20 text-green-600 border-green-500/30",
  Error: "bg-red-500/20 text-red-600 border-red-500/30",
  idle: "bg-gray-500/20 text-gray-500 border-gray-500/30",
};

export default function StatusCards({ topic, status, lastUpdated, running, currentStep }: StatusCardsProps) {
  const colorClass = STATUS_COLORS[status] ?? STATUS_COLORS.idle;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div
        className="border rounded-xl p-4"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <p className="text-xs text-app-muted uppercase tracking-wider mb-1">Today&apos;s Topic</p>
        <p className="text-lg font-semibold text-app-text">{topic ?? "—"}</p>
      </div>
      <div
        className="border rounded-xl p-4"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <p className="text-xs text-app-muted uppercase tracking-wider mb-1">Pipeline Status</p>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClass}`}>
            {running ? currentStep : status}
          </span>
          {running && (
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
          )}
        </div>
      </div>
      <div
        className="border rounded-xl p-4"
        style={{ backgroundColor: "var(--app-surface)", borderColor: "var(--app-border)" }}
      >
        <p className="text-xs text-app-muted uppercase tracking-wider mb-1">Last Updated</p>
        <p className="text-sm text-app-subtle">
          {lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
        </p>
      </div>
    </div>
  );
}
