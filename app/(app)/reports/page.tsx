import { EmptyState } from "~/components/ui/EmptyState";
import { PageHeader } from "~/components/ui/PageHeader";
import { ReportsCharts } from "~/components/charts/ReportsCharts";
import { getCategoryBreakdown, getIncomeVsExpenses, getMonthlySpendingSummary } from "~/lib/saveflow";
import { requireSupabaseUser } from "~/lib/supabase-server";
import type { Profile, Transaction } from "~/lib/types";

export default async function ReportsPage() {
  const { supabase, user } = await requireSupabaseUser();
  const [{ data: profile }, { data: transactions }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("transactions").select("*").order("date", { ascending: true }).returns<Transaction[]>()
  ]);

  const monthlySpending = getMonthlySpendingSummary(transactions ?? []);
  const categoryBreakdown = getCategoryBreakdown(transactions ?? []);
  const incomeVsExpenses = getIncomeVsExpenses(transactions ?? []);

  return (
    <div>
      <PageHeader
        title="Reports"
        description="See monthly spending patterns, understand where money goes by category, and compare income against expenses over time."
      />
      {transactions?.length ? (
        <ReportsCharts
          monthlySpending={monthlySpending}
          categoryBreakdown={categoryBreakdown}
          incomeVsExpenses={incomeVsExpenses}
          currency={profile?.currency ?? "USD"}
        />
      ) : (
        <EmptyState title="No report data yet" description="Add a few transactions and SaveFlow will build your monthly and category-level charts automatically." />
      )}
    </div>
  );
}
