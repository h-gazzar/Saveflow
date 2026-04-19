import { cn } from "~/lib/utils";

const tones: Record<string, string> = {
  income: "status-paid",
  expense: "status-unpaid",
  active: "status-active",
  completed: "status-done",
  overdue: "status-overdue",
  neutral: "status-neutral"
};

export function Badge({ label, tone }: { label: string; tone?: string }) {
  return <span className={cn("status-badge", tones[tone ?? label.toLowerCase()] ?? tones.neutral)}>{label}</span>;
}
