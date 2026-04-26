"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createSupabaseBrowserClient } from "~/lib/supabase-browser";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2).optional()
});

type AuthValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [signupNotice, setSignupNotice] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<AuthValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const supabase = createSupabaseBrowserClient();
      setSignupNotice(null);

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: { full_name: values.fullName ?? "" },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (error) {
          setError("root", { message: error.message });
          return;
        }

        if (!data.session) {
          setSignupNotice("Account created. Check your email to confirm your address, then log in.");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password
        });

        if (error) {
          setError("root", { message: error.message });
          return;
        }
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reach authentication service. Check your connection and configuration.";
      setError("root", { message });
    }
  });

  return (
    <div className="surface-card w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <Link href="/" className="font-sans text-3xl font-extrabold uppercase tracking-[0.18em]">
          save<span className="text-accent">flow</span>
        </Link>
        <h1 className="mt-6 font-sans text-3xl font-extrabold uppercase">{mode === "login" ? "Log in" : "Create account"}</h1>
        <p className="mt-3 text-sm text-muted">
          {mode === "login" ? "Pick up where your saving plan left off." : "Start tracking spending and funding goals in one clean workspace."}
        </p>
        {signupNotice ? <p className="mt-4 text-sm text-accent">{signupNotice}</p> : null}
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" ? <input {...register("fullName")} placeholder="Full name" className="input-base" /> : null}
        <input {...register("email")} type="email" placeholder="Email" className="input-base" />
        {errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
        <input {...register("password")} type="password" placeholder="Password" className="input-base" />
        {errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
        {mode === "login" ? (
          <p className="text-right text-sm text-muted">
            <Link href="/forgot-password" className="text-accent">
              Forgot password?
            </Link>
          </p>
        ) : null}
        {errors.root ? <p className="text-sm text-red-300">{errors.root.message}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Working..." : mode === "login" ? "Log in" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        {mode === "login" ? "Need an account?" : "Already signed up?"}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="text-accent">
          {mode === "login" ? "Sign up" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
