"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BrandMark } from "~/components/ui/BrandMark";
import { appUrl } from "~/lib/app-url";
import { createSupabaseBrowserClient } from "~/lib/supabase-browser";

const schema = z.object({
  email: z.string().email("Enter a valid email address")
});

type ForgotPasswordValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const supabase = createSupabaseBrowserClient();
      setSentMessage(null);

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${appUrl}/reset-password`
      });

      if (error) {
        setError("root", { message: error.message });
        return;
      }

      setSentMessage("Reset link sent. Check your inbox for the password reset email.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reach authentication service. Check your connection and configuration.";
      setError("root", { message });
    }
  });

  return (
    <div className="surface-card w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <BrandMark size="lg" className="mx-auto" />
        <h1 className="mt-6 font-sans text-3xl font-extrabold uppercase">Forgot password</h1>
        <p className="mt-3 text-sm text-muted">Enter your email and we will send you a reset link.</p>
        {sentMessage ? <p className="mt-4 text-sm text-accent">{sentMessage}</p> : null}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <input {...register("email")} type="email" placeholder="Email" className="input-base" />
        {errors.email ? <p className="text-sm text-red-300">{errors.email.message}</p> : null}
        {errors.root ? <p className="text-sm text-red-300">{errors.root.message}</p> : null}
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Remembered your password?{" "}
        <Link href="/login" className="text-accent">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
