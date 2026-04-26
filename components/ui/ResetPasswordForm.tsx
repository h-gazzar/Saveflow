"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { BrandMark } from "~/components/ui/BrandMark";
import { createSupabaseBrowserClient } from "~/lib/supabase-browser";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password")
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type ResetPasswordValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema)
  });

  useEffect(() => {
    let supabase;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      setHasRecoverySession(false);
      return;
    }

    let isMounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setHasRecoverySession(Boolean(data.session));
    };

    checkSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setHasRecoverySession(Boolean(session));
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const supabase = createSupabaseBrowserClient();
      setSuccessMessage(null);

      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) {
        setError("root", { message: error.message });
        return;
      }

      setSuccessMessage("Password updated. Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1200);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to reach authentication service. Check your connection and configuration.";
      setError("root", { message });
    }
  });

  return (
    <div className="surface-card w-full max-w-md p-8">
      <div className="mb-8 text-center">
        <BrandMark size="lg" className="mx-auto" />
        <h1 className="mt-6 font-sans text-3xl font-extrabold uppercase">Reset password</h1>
        <p className="mt-3 text-sm text-muted">Set your new password to secure your account.</p>
      </div>

      {hasRecoverySession === false ? (
        <div className="space-y-4 text-center">
          <p className="text-sm text-red-300">This reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="btn-primary w-full">
            Request a new link
          </Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input {...register("password")} type="password" placeholder="New password" className="input-base" />
          {errors.password ? <p className="text-sm text-red-300">{errors.password.message}</p> : null}
          <input {...register("confirmPassword")} type="password" placeholder="Confirm password" className="input-base" />
          {errors.confirmPassword ? <p className="text-sm text-red-300">{errors.confirmPassword.message}</p> : null}
          {errors.root ? <p className="text-sm text-red-300">{errors.root.message}</p> : null}
          {successMessage ? <p className="text-sm text-accent">{successMessage}</p> : null}
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting || hasRecoverySession === null}>
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/login" className="text-accent">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
