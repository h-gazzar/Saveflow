import { Sidebar } from "~/components/ui/Sidebar";
import { requireSupabaseUser } from "~/lib/supabase-server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireSupabaseUser();

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="min-h-screen px-4 py-6 lg:ml-[220px] lg:p-6">{children}</main>
    </div>
  );
}
