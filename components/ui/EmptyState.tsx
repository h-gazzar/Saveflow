export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="surface-card p-8 text-center">
      <h3 className="font-sans text-2xl font-extrabold uppercase">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
