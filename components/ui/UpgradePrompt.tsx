import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function UpgradePrompt({
  title = "Upgrade to Pro",
  description = "Unlock lead pipeline, time tracking, and higher usage limits."
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="surface-card border-accent/40 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Pro Feature</p>
          <h3 className="mt-2 font-sans text-2xl font-extrabold uppercase">{title}</h3>
        </div>
        <span className="status-badge status-warning">Free Plan</span>
      </div>
      <p className="max-w-xl text-sm leading-7 text-muted">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-off-white/85">
        <span className="rounded-full border border-border px-3 py-2">Lead pipeline</span>
        <span className="rounded-full border border-border px-3 py-2">Time tracking</span>
        <span className="rounded-full border border-border px-3 py-2">Higher limits</span>
      </div>
      <Link href="/settings/billing" className="btn-primary mt-6 inline-flex">
        Upgrade to Pro
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
