"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Badge } from "~/components/ui/Badge";
import { EmptyState } from "~/components/ui/EmptyState";
import { TransactionFormDialog } from "~/components/ui/TransactionFormDialog";
import { createSupabaseBrowserClient } from "~/lib/supabase-browser";
import { formatCurrency, formatDate } from "~/lib/saveflow";
import type { CurrencyCode, SavingsGoal, Transaction } from "~/lib/types";

type Filters = {
  type: "all" | "income" | "expense";
  category: string;
  month: string;
};

export function TransactionsManager({
  transactions,
  goals,
  currency
}: {
  transactions: Transaction[];
  goals: Pick<SavingsGoal, "id" | "title">[];
  currency: CurrencyCode;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    type: "all",
    category: "all",
    month: "all"
  });

  const filtered = useMemo(
    () =>
      transactions.filter((transaction) => {
        const typeMatch = filters.type === "all" || transaction.type === filters.type;
        const categoryMatch = filters.category === "all" || transaction.category === filters.category;
        const monthMatch =
          filters.month === "all" ||
          new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit" }).format(new Date(transaction.date)) === filters.month;
        return typeMatch && categoryMatch && monthMatch;
      }),
    [filters, transactions]
  );

  const categories = [...new Set(transactions.map((transaction) => transaction.category))];
  const months = [...new Set(transactions.map((transaction) => new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit" }).format(new Date(transaction.date))))];

  async function removeTransaction(id: string) {
    const supabase = createSupabaseBrowserClient();
    await supabase.from("transactions").delete().eq("id", id);
    router.refresh();
  }

  if (!transactions.length) {
    return <EmptyState title="No transactions yet" description="Add your first income or expense entry to see balance and reports come to life." />;
  }

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-4 md:grid-cols-3">
        <select className="input-base" value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value as Filters["type"] }))}>
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className="input-base" value={filters.category} onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}>
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select className="input-base" value={filters.month} onChange={(event) => setFilters((current) => ({ ...current, month: event.target.value }))}>
          <option value="all">All months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="surface-card overflow-hidden">
        <div className="grid grid-cols-[1.1fr_0.7fr_0.9fr_0.9fr_1.1fr_0.7fr] border-b border-border bg-white/[0.02] px-5 py-3 text-xs uppercase tracking-[0.25em] text-muted">
          <div>Type</div>
          <div>Amount</div>
          <div>Category</div>
          <div>Date</div>
          <div>Linked goal</div>
          <div />
        </div>
        <div className="divide-y divide-border">
          {filtered.map((transaction) => (
            <div key={transaction.id} className="grid grid-cols-[1.1fr_0.7fr_0.9fr_0.9fr_1.1fr_0.7fr] items-center gap-4 px-5 py-4 text-sm">
              <div className="space-y-1">
                <Badge label={transaction.type} />
                {transaction.note ? <p className="text-xs text-muted">{transaction.note}</p> : null}
              </div>
              <div>{formatCurrency(transaction.amount, currency)}</div>
              <div>{transaction.category}</div>
              <div>{formatDate(transaction.date)}</div>
              <div>{transaction.savings_goals?.title ?? "None"}</div>
              <div className="flex justify-end gap-2">
                <TransactionFormDialog transaction={transaction} goals={goals} triggerLabel="Edit" />
                <button className="btn-ghost px-3" onClick={() => void removeTransaction(transaction.id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
