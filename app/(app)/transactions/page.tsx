import { PageHeader } from "~/components/ui/PageHeader";
import { TransactionFormDialog } from "~/components/ui/TransactionFormDialog";
import { TransactionsManager } from "~/components/ui/TransactionsManager";
import { requireSupabaseUser } from "~/lib/supabase-server";
import type { Profile, SavingsGoal, Transaction } from "~/lib/types";

export default async function TransactionsPage() {
  const { supabase, user } = await requireSupabaseUser();
  const [{ data: profile }, { data: goals }, { data: transactions }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("savings_goals").select("id, title").order("created_at", { ascending: false }).returns<Pick<SavingsGoal, "id" | "title">[]>(),
    supabase
      .from("transactions")
      .select("*, savings_goals(id, title)")
      .order("date", { ascending: false })
      .returns<Transaction[]>()
  ]);

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Track income and spending in one place, filter activity quickly, and connect entries to savings goals when useful."
        action={<TransactionFormDialog goals={goals ?? []} triggerLabel="Add transaction" />}
      />
      <TransactionsManager transactions={transactions ?? []} goals={goals ?? []} currency={profile?.currency ?? "USD"} />
    </div>
  );
}
