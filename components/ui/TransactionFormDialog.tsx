"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { Modal } from "~/components/ui/Modal";
import { createSupabaseBrowserClient } from "~/lib/supabase-browser";
import { transactionCategories } from "~/lib/saveflow";
import type { SavingsGoal, Transaction } from "~/lib/types";

const OTHER_CATEGORY = "Other";

const schema = z
  .object({
    type: z.enum(["income", "expense"]),
    amount: z.coerce.number().positive(),
    category: z.string().min(2),
    custom_category: z.string().optional(),
    date: z.string().min(1),
    note: z.string().optional(),
    savings_goal_id: z.string().optional()
  })
  .superRefine((values, ctx) => {
    if (values.category === OTHER_CATEGORY && (!values.custom_category || values.custom_category.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["custom_category"],
        message: "Enter a category name."
      });
    }
  });

type TransactionValues = z.infer<typeof schema>;

export function TransactionFormDialog({
  transaction,
  goals,
  triggerLabel
}: {
  transaction?: Transaction;
  goals: Pick<SavingsGoal, "id" | "title">[];
  triggerLabel: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError
  } = useForm<TransactionValues>({
    resolver: zodResolver(schema),
    defaultValues: transaction
      ? {
          type: transaction.type,
          amount: transaction.amount,
          category: transactionCategories.includes(transaction.category as (typeof transactionCategories)[number]) ? transaction.category : OTHER_CATEGORY,
          custom_category: transactionCategories.includes(transaction.category as (typeof transactionCategories)[number]) ? "" : transaction.category,
          date: transaction.date.slice(0, 10),
          note: transaction.note ?? "",
          savings_goal_id: transaction.savings_goal_id ?? ""
        }
      : {
          type: "expense",
          category: transactionCategories[0],
          custom_category: "",
          date: new Date().toISOString().slice(0, 10),
          savings_goal_id: ""
        }
  });

  const type = watch("type");
  const category = watch("category");

  const onSubmit = handleSubmit(async (values) => {
    const supabase = createSupabaseBrowserClient();
    const payload = {
      ...values,
      category: values.category === OTHER_CATEGORY ? values.custom_category!.trim() : values.category,
      note: values.note || null,
      savings_goal_id: values.savings_goal_id || null
    };
    delete payload.custom_category;

    const query = transaction
      ? supabase.from("transactions").update(payload).eq("id", transaction.id)
      : supabase.from("transactions").insert(payload);

    const { error } = await query;
    if (error) {
      setError("root", { message: error.message });
      return;
    }

    router.refresh();
  });

  return (
    <Modal
      title={transaction ? "Edit transaction" : "Add transaction"}
      description="Keep income and expense activity current so your balance and reports stay useful."
      trigger={<button className={transaction ? "btn-ghost" : "btn-primary"}>{triggerLabel}</button>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-xs uppercase tracking-[0.2em] text-muted">Payment type</span>
            <select {...register("type")} className="input-base">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="block text-xs uppercase tracking-[0.2em] text-muted">Amount</span>
            <input {...register("amount")} type="number" step="0.01" placeholder="Amount" className="input-base" />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-xs uppercase tracking-[0.2em] text-muted">
              {type === "income" ? "Income category" : "Expense category"}
            </span>
            <select {...register("category")} className="input-base">
              {transactionCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="block text-xs uppercase tracking-[0.2em] text-muted">Date</span>
            <input {...register("date")} type="date" className="input-base" />
          </label>
        </div>
        {category === OTHER_CATEGORY ? (
          <label className="space-y-2">
            <span className="block text-xs uppercase tracking-[0.2em] text-muted">
              {type === "income" ? "Custom income category" : "Custom expense category"}
            </span>
            <input
              {...register("custom_category")}
              placeholder={type === "income" ? "Example: Bonus" : "Example: Pet care"}
              className="input-base"
            />
            {errors.custom_category ? <p className="text-sm text-red-300">{errors.custom_category.message}</p> : null}
          </label>
        ) : null}
        <label className="space-y-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-muted">Linked goal</span>
          <select {...register("savings_goal_id")} className="input-base">
            <option value="">No linked goal</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="block text-xs uppercase tracking-[0.2em] text-muted">Note</span>
          <textarea {...register("note")} className="input-base min-h-24" placeholder={type === "income" ? "Optional income note" : "Optional expense note"} />
        </label>
        {errors.root ? <p className="text-sm text-red-300">{errors.root.message}</p> : null}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner label="Saving..." /> : transaction ? "Update transaction" : "Add transaction"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
