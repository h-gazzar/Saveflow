"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LoadingSpinner } from "~/components/ui/LoadingSpinner";
import { createSupabaseBrowserClient } from "~/lib/supabase-browser";
import { currencyOptions, isSupportedCurrency } from "~/lib/saveflow";
import type { Profile } from "~/lib/types";

const schema = z.object({
  full_name: z.string().min(2),
  currency: z.string().refine(isSupportedCurrency, "Choose a valid currency.")
});

type SettingsValues = z.infer<typeof schema>;

export function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<SettingsValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: profile.full_name ?? "",
      currency: profile.currency
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from("profiles").update(values).eq("id", profile.id);

    if (error) {
      setError("root", { message: error.message });
      return;
    }

    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="surface-card max-w-2xl space-y-5 p-6">
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">Email</label>
        <input className="input-base opacity-70" value={profile.email ?? ""} disabled />
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">Full name</label>
        <input {...register("full_name")} className="input-base" />
        {errors.full_name ? <p className="mt-2 text-sm text-red-300">{errors.full_name.message}</p> : null}
      </div>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">Currency</label>
        <select {...register("currency")} className="input-base">
          {currencyOptions.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.label}
            </option>
          ))}
        </select>
      </div>
      {errors.root ? <p className="text-sm text-red-300">{errors.root.message}</p> : null}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Currency setting is functional. Deeper localization can be expanded later.</p>
        <button className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <LoadingSpinner label="Saving..." /> : "Save changes"}
        </button>
      </div>
    </form>
  );
}
