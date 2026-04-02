export const LIMITS = {
  free: { clients: 3, projects: 5, invoices: 5 },
  pro: { clients: Infinity, projects: Infinity, invoices: Infinity },
  agency: { clients: Infinity, projects: Infinity, invoices: Infinity }
} as const;

export const PLAN_FEATURES = {
  free: { leads: false, time: false, pdfInvoices: false },
  pro: { leads: true, time: true, pdfInvoices: false },
  agency: { leads: true, time: true, pdfInvoices: true }
} as const;

export type PlanKey = keyof typeof LIMITS;

export function normalizePlan(plan?: string | null): PlanKey {
  if (plan === "pro" || plan === "agency") {
    return plan;
  }

  return "free";
}

export function canUseFeature(plan: string | null | undefined, feature: keyof (typeof PLAN_FEATURES)["free"]) {
  const normalized = normalizePlan(plan);
  return PLAN_FEATURES[normalized][feature];
}

export function getPlanLimit(plan: string | null | undefined, resource: keyof (typeof LIMITS)["free"]) {
  const normalized = normalizePlan(plan);
  return LIMITS[normalized][resource];
}
