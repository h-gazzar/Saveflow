export type CurrencyCode = string;

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  currency: CurrencyCode;
  created_at: string;
  updated_at: string;
};

export type SavingsGoal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  current_saved: number;
  target_date: string | null;
  category: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  note: string | null;
  savings_goal_id: string | null;
  created_at: string;
  updated_at: string;
  savings_goals?: Pick<SavingsGoal, "id" | "title"> | null;
};
