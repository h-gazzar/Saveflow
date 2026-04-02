import { AuthForm } from "~/components/ui/AuthForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <AuthForm mode="signup" />
    </main>
  );
}
