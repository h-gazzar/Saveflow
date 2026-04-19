import { AuthForm } from "~/components/ui/AuthForm";
import { redirectIfAuthenticated } from "~/lib/supabase-server";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <AuthForm mode="login" />
    </main>
  );
}
