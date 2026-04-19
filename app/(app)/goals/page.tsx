import { GoalFormDialog } from "~/components/ui/GoalFormDialog";
import { GoalsManager } from "~/components/ui/GoalsManager";
import { PageHeader } from "~/components/ui/PageHeader";
import { requireSupabaseUser } from "~/lib/supabase-server";
import type { Profile, SavingsGoal } from "~/lib/types";

export default async function GoalsPage() {
  const { supabase, user } = await requireSupabaseUser();
  const [{ data: profile }, { data: goals }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
    supabase.from("savings_goals").select("*").order("created_at", { ascending: false }).returns<SavingsGoal[]>()
  ]);

  return (
    <div>
      <PageHeader
        title="Goals"
        description="Create savings targets, monitor progress, and see what you need to save each week to stay on pace."
        action={<GoalFormDialog triggerLabel="Create goal" />}
      />
      <GoalsManager goals={goals ?? []} currency={profile?.currency ?? "USD"} />
    </div>
  );
}
