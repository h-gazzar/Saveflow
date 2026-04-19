import { PageHeader } from "~/components/ui/PageHeader";
import { SettingsForm } from "~/components/ui/SettingsForm";
import { requireSupabaseUser } from "~/lib/supabase-server";
import type { Profile } from "~/lib/types";

export default async function SettingsPage() {
  const { supabase, user } = await requireSupabaseUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single<Profile>();

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Update your profile basics and choose the currency used across balances, goals, and reports."
      />
      <SettingsForm profile={profile} />
    </div>
  );
}
