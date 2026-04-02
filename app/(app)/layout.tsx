import { Sidebar } from "~/components/ui/Sidebar";
import { requireUser } from "~/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />
      <main className="ml-[180px] min-h-screen p-6">{children}</main>
    </div>
  );
}
