import { Badge } from "~/components/ui/Badge";
import { CurrencySelector } from "~/components/ui/CurrencySelector";
import { EmptyState } from "~/components/ui/EmptyState";
import { GoalFormDialog } from "~/components/ui/GoalFormDialog";
import { PageHeader } from "~/components/ui/PageHeader";
import { SummaryCard } from "~/components/ui/SummaryCard";
import { TransactionFormDialog } from "~/components/ui/TransactionFormDialog";
import { calculateBalance, formatCurrency, formatDate, getGoalProgress, getMonthlyTotals } from "~/lib/saveflow";
import { requireSupabaseUser } from "~/lib/supabase-server";
import type { Profile, SavingsGoal, Transaction } from "~/lib/types";

export default async function DashboardPage() {
  const { supabase, user } = await requireSupabaseUser();

  const [{ data: profile }, { data: goals }, { data: transactions }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("savings_goals").select("*").order("created_at", { ascending: false }).returns<SavingsGoal[]>(),
    supabase
      .from("transactions")
      .select("*, savings_goals(id, title)")
      .order("date", { ascending: false })
      .limit(5)
      .returns<Transaction[]>()
  ]);

  const currency = profile?.currency ?? "USD";
  const allTransactions = (
    await supabase.from("transactions").select("*").returns<Transaction[]>()
  ).data ?? [];
  const monthly = getMonthlyTotals(allTransactions);
  const balance = calculateBalance(allTransactions);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A lightweight overview of your balance, monthly cash flow, goals in progress, and the latest money moves."
        action={
          <div className="flex flex-wrap gap-3">
            {profile ? <CurrencySelector profileId={profile.id} currency={currency} /> : null}
            <GoalFormDialog triggerLabel="New goal" />
            <TransactionFormDialog goals={goals ?? []} triggerLabel="Quick add transaction" />
          </div>
        }
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <SummaryCard label="Total balance" value={formatCurrency(balance, currency)} hint="Income minus expenses" />
        <SummaryCard label="Income this month" value={formatCurrency(monthly.income, currency)} hint="Current month inflows" />
        <SummaryCard label="Expenses this month" value={formatCurrency(monthly.expenses, currency)} hint="Current month outflows" />
      </div>
      <div className="mt-8 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="surface-card p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-sans text-2xl font-extrabold uppercase">Savings goals</h2>
            <div className="flex items-center gap-3">
              <GoalFormDialog triggerLabel="+ Add goal" />
              <Badge label={`${goals?.length ?? 0} active`} tone="neutral" />
            </div>
          </div>
          {goals?.length ? (
            <div className="space-y-4">
              {goals.slice(0, 4).map((goal) => (
                <div key={goal.id} className="rounded-sm border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-sans text-lg font-extrabold uppercase">{goal.title}</p>
                      <p className="mt-1 text-sm text-muted">{goal.category}</p>
                    </div>
                    <p className="text-sm text-accent">{Math.round(getGoalProgress(goal) * 100)}%</p>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-white/[0.05]">
                    <div className="h-3 rounded-full bg-accent" style={{ width: `${getGoalProgress(goal) * 100}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-muted">
                    <span>{formatCurrency(goal.current_saved, currency)} saved</span>
                    <span>{formatCurrency(goal.target_amount, currency)} target</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No active goals" description="Create a savings goal to start seeing progress cards and recommendations here." />
          )}
        </div>
        <div className="surface-card p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-sans text-2xl font-extrabold uppercase">Recent transactions</h2>
            <Badge label={`${transactions?.length ?? 0} recent`} tone="neutral" />
          </div>
          {transactions?.length ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="rounded-sm border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge label={transaction.type} />
                        <p className="text-sm text-muted">{transaction.category}</p>
                      </div>
                      <p className="mt-3 text-sm text-muted">{formatDate(transaction.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-sans text-lg font-extrabold uppercase">{formatCurrency(transaction.amount, currency)}</p>
                      <p className="mt-1 text-xs text-muted">{transaction.savings_goals?.title ?? "No linked goal"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No transactions yet" description="Once you start tracking income and spending, your latest activity will appear here." />
          )}
        </div>
      </div>
    </div>
  );
}
