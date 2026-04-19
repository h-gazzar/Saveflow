import { AuthForm } from "~/components/ui/AuthForm";
import { redirectIfAuthenticated } from "~/lib/supabase-server";

export default async function SignupPage() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <AuthForm mode="signup" />
    </main>
  );
}
