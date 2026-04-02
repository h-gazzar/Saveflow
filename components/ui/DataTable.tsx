import { cn } from "~/lib/utils";

export function DataTable({
  headers,
  rows,
  className
}: {
  headers: string[];
  rows: React.ReactNode[][];
  className?: string;
}) {
  return (
    <div className={cn("surface-card overflow-hidden", className)}>
      <div className="grid border-b border-border bg-white/[0.02] px-5 py-3 text-xs uppercase tracking-[0.25em] text-muted" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
        {headers.map((header) => (
          <div key={header}>{header}</div>
        ))}
      </div>
      <div className="divide-y divide-border">
        {rows.map((row, index) => (
          <div key={index} className="grid items-center gap-4 px-5 py-4 text-sm" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
            {row.map((cell, cellIndex) => (
              <div key={cellIndex}>{cell}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
