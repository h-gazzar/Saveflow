export function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-accent">{eyebrow ?? "SaveFlow"}</p>
        <h1 className="mt-2 font-sans text-4xl font-extrabold uppercase">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}
