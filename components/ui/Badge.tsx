import { cn } from "~/lib/utils";

const statusClassMap: Record<string, string> = {
  paid: "status-paid",
  active: "status-active",
  won: "status-won",
  proposal: "status-proposal",
  warning: "status-warning",
  negotiation: "status-negotiation",
  contacted: "status-contacted",
  unpaid: "status-unpaid",
  lost: "status-lost",
  overdue: "status-overdue",
  done: "status-done",
  neutral: "status-neutral",
  lead: "status-lead"
};

export function Badge({ label, tone }: { label: string; tone?: string }) {
  const key = (tone ?? label).toLowerCase();
  return <span className={cn("status-badge", statusClassMap[key] ?? "status-neutral")}>{label}</span>;
}
