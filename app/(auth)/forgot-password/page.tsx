import { ForgotPasswordForm } from "~/components/ui/ForgotPasswordForm";
import { redirectIfAuthenticated } from "~/lib/supabase-server";

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <ForgotPasswordForm />
    </main>
  );
}
