import { cn } from "~/lib/utils";

export function MetricCard({
  label,
  value,
  subtext,
  className
}: {
  label: string;
  value: string;
  subtext: string;
  className?: string;
}) {
  return (
    <div className={cn("surface-card p-5", className)}>
      <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted">{label}</p>
      <div className="font-sans text-4xl font-extrabold uppercase text-off-white">{value}</div>
      <p className="mt-3 text-sm text-accent">{subtext}</p>
    </div>
  );
}
