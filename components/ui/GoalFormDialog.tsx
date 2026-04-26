"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { goalCategories } from "~/lib/saveflow";
import { createSupabaseBrowserClient } from "~/lib/supabase-browser";
import type { SavingsGoal } from "~/lib/types";
import { Modal } from "~/components/ui/Modal";

const schema = z.object({
  title: z.string().min(2),
  target_amount: z.coerce.number().positive(),
  current_saved: z.coerce.number().min(0),
  target_date: z.string().optional(),
  category: z.string().min(2),
  notes: z.string().optional()
});

type GoalValues = z.infer<typeof schema>;

export function GoalFormDialog({
  goal,
  triggerLabel
}: {
  goal?: SavingsGoal;
  triggerLabel: string;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<GoalValues>({
    resolver: zodResolver(schema),
    defaultValues: goal
      ? {
          title: goal.title,
          target_amount: goal.target_amount,
          current_saved: goal.current_saved,
          target_date: goal.target_date?.slice(0, 10) ?? "",
          category: goal.category,
          notes: goal.notes ?? ""
        }
      : {
          category: goalCategories[0],
          current_saved: 0
        }
  });

  const onSubmit = handleSubmit(async (values) => {
    const supabase = createSupabaseBrowserClient();
    const payload = {
      ...values,
      target_date: values.target_date || null,
      notes: values.notes || null
    };

    const query = goal
      ? supabase.from("savings_goals").update(payload).eq("id", goal.id)
      : supabase.from("savings_goals").insert(payload);

    const { error } = await query;
    if (error) {
      setError("root", { message: error.message });
      return;
    }

    router.refresh();
  });

  return (
    <Modal
      title={goal ? "Edit goal" : "Create goal"}
      description="Capture a target, how much you already have saved, and how soon you want to get there."
      trigger={<button className={goal ? "btn-ghost" : "btn-primary"}>{triggerLabel}</button>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <input {...register("title")} placeholder="Goal title" className="input-base" />
        <div className="grid gap-4 md:grid-cols-2">
          <input {...register("target_amount")} type="number" step="0.01" placeholder="Target amount" className="input-base" />
          <input {...register("current_saved")} type="number" step="0.01" placeholder="Current saved" className="input-base" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input {...register("target_date")} type="date" className="input-base" />
          <select {...register("category")} className="input-base">
            {goalCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <textarea {...register("notes")} className="input-base min-h-24" placeholder="Notes" />
        {errors.root ? <p className="text-sm text-red-300">{errors.root.message}</p> : null}
        <div className="flex justify-end">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? <LoadingSpinner label="Saving..." /> : goal ? "Update goal" : "Create goal"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
