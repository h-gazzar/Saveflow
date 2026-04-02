"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "~/lib/supabase-browser";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const supabase = createSupabaseBrowserClient();
    setLoading(true);
    setError(null);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`
            }
          });

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleMagicLink(email: string) {
    const supabase = createSupabaseBrowserClient();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setError("Magic link sent. Check your inbox.");
    }

    setLoading(false);
  }

  return (
    <div className="surface-card w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <Link href="/" className="font-sans text-3xl font-extrabold uppercase tracking-[0.18em]">
          solo<span className="text-accent">flow</span>
        </Link>
        <h1 className="mt-6 font-sans text-3xl font-extrabold uppercase">{mode === "login" ? "Welcome back" : "Create account"}</h1>
      </div>
      <form
        action={(formData) => {
          void handleSubmit(formData);
        }}
        className="space-y-4"
      >
        <input name="email" type="email" placeholder="Email" className="input-base" required />
        <input name="password" type="password" placeholder="Password" className="input-base" required />
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Please wait" : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-muted">
        <div className="h-px flex-1 bg-border" />
        <span>Or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <button
        className="btn-ghost w-full"
        onClick={() => {
          const email = (document.querySelector('input[name="email"]') as HTMLInputElement | null)?.value ?? "";
          void handleMagicLink(email);
        }}
        disabled={loading}
      >
        Send magic link
      </button>
      {error ? <p className="mt-4 text-sm text-muted">{error}</p> : null}
      <p className="mt-6 text-center text-sm text-muted">
        {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="text-accent">
          {mode === "login" ? "Sign up" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
