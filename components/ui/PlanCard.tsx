import { Check, X } from "lucide-react";

import { cn } from "~/lib/utils";

export function PlanCard({
  name,
  price,
  features,
  popular,
  compact,
  footer
}: {
  name: string;
  price: string;
  features: { label: string; included: boolean }[];
  popular?: boolean;
  compact?: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <div className={cn("surface-card flex h-full flex-col p-6", popular && "border-accent/40")}>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">{name}</p>
          <h3 className="mt-2 font-sans text-3xl font-extrabold uppercase">{price}</h3>
        </div>
        {popular ? <span className="status-badge status-warning">Most popular</span> : null}
      </div>
      <div className={cn("space-y-3", compact && "space-y-2")}>
        {features.map((feature) => (
          <div key={feature.label} className="flex items-center gap-3 text-sm text-muted">
            {feature.included ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-muted" />}
            <span>{feature.label}</span>
          </div>
        ))}
      </div>
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}
