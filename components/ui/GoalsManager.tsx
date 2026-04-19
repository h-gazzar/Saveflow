"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Badge } from "~/components/ui/Badge";
import { EmptyState } from "~/components/ui/EmptyState";
import { GoalFormDialog } from "~/components/ui/GoalFormDialog";
import { createSupabaseBrowserClient } from "~/lib/supabase-browser";
import { formatCurrency, formatDate, getGoalProgress, getGoalRemaining, getGoalStatus, getWeeklySavingsTarget } from "~/lib/saveflow";
import type { CurrencyCode, SavingsGoal } from "~/lib/types";

export function GoalsManager({
  goals,
  currency
}: {
  goals: SavingsGoal[];
  currency: CurrencyCode;
}) {
  const router = useRouter();

  async function removeGoal(id: string) {
    const supabase = createSupabaseBrowserClient();
    await supabase.from("savings_goals").delete().eq("id", id);
    router.refresh();
  }

  if (!goals.length) {
    return <EmptyState title="No goals yet" description="Create your first savings goal to start tracking progress and weekly targets." />;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {goals.map((goal) => {
        const progress = getGoalProgress(goal);
        const remaining = getGoalRemaining(goal);
        const weekly = getWeeklySavingsTarget(goal);
        const status = getGoalStatus(goal);

        return (
          <div key={goal.id} className="surface-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-sans text-2xl font-extrabold uppercase">{goal.title}</h3>
                  <Badge label={status} />
                </div>
                <p className="mt-2 text-sm text-muted">{goal.category}</p>
              </div>
              <div className="flex gap-2">
                <GoalFormDialog goal={goal} triggerLabel="Edit" />
                <button className="btn-ghost px-3" onClick={() => void removeGoal(goal.id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>{formatCurrency(goal.current_saved, currency)} saved</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="h-3 rounded-full bg-white/[0.05]">
                <div className="h-3 rounded-full bg-accent" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Target</p>
                <p className="mt-2 text-sm">{formatCurrency(goal.target_amount, currency)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Remaining</p>
                <p className="mt-2 text-sm">{formatCurrency(remaining, currency)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted">Target date</p>
                <p className="mt-2 text-sm">{goal.target_date ? formatDate(goal.target_date) : "Flexible"}</p>
              </div>
            </div>
            <div className="mt-5 rounded-sm border border-border bg-white/[0.02] p-4 text-sm text-muted">
              {weekly === null
                ? status === "overdue"
                  ? "This goal is overdue. Update the target date or add more savings to get it back on track."
                  : "Add a target date to get a weekly savings suggestion."
                : `Suggested weekly savings: ${formatCurrency(weekly, currency)} per week.`}
            </div>
            {goal.notes ? <p className="mt-4 text-sm leading-7 text-muted">{goal.notes}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
