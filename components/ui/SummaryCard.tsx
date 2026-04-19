export function SummaryCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs uppercase tracking-[0.25em] text-muted">{label}</p>
      <p className="mt-4 font-sans text-4xl font-extrabold uppercase">{value}</p>
      <p className="mt-3 text-sm text-accent">{hint}</p>
    </div>
  );
}
