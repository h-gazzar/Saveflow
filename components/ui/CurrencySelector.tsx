"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "~/lib/supabase-browser";
import { currencyOptions } from "~/lib/saveflow";
import type { CurrencyCode } from "~/lib/types";

export function CurrencySelector({
  profileId,
  currency
}: {
  profileId: string;
  currency: CurrencyCode;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  return (
    <label className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-[0.2em] text-muted">Currency</span>
      <select
        className="input-base w-auto min-w-[92px] py-3"
        value={currency}
        disabled={isSaving}
        onChange={async (event) => {
          const nextCurrency = event.target.value as CurrencyCode;
          setIsSaving(true);

          const supabase = createSupabaseBrowserClient();
          await supabase.from("profiles").update({ currency: nextCurrency }).eq("id", profileId);

          setIsSaving(false);
          router.refresh();
        }}
      >
        {currencyOptions.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.label}
          </option>
        ))}
      </select>
    </label>
  );
}
