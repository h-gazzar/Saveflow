import { differenceInCalendarDays, endOfMonth, isPast, startOfMonth } from "date-fns";

import type { CurrencyCode, SavingsGoal, Transaction, TransactionType } from "~/lib/types";

const fallbackCurrencyCodes = ["USD", "EUR", "GBP", "EGP"] as const;

export const currencyCodes = typeof Intl.supportedValuesOf === "function"
  ? [...Intl.supportedValuesOf("currency")].sort()
  : [...fallbackCurrencyCodes];

const currencyDisplayNames = typeof Intl.DisplayNames === "function"
  ? new Intl.DisplayNames(["en"], { type: "currency" })
  : null;

export const currencyOptions = currencyCodes.map((code) => ({
  code,
  label: currencyDisplayNames?.of(code) ? `${code} - ${currencyDisplayNames.of(code)}` : code
}));

const currencyCodeSet = new Set(currencyCodes);

export function isSupportedCurrency(value: string): value is CurrencyCode {
  return currencyCodeSet.has(value);
}

export const goalCategories = ["Emergency", "Travel", "Home", "Education", "Health", "Business", "Tech", "Other"] as const;
export const transactionCategories = [
  "Salary",
  "Freelance",
  "Food",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Entertainment",
  "Savings",
  "Other"
] as const;

export function formatCurrency(amount: number, currency: CurrencyCode = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "No date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
}

export function getGoalProgress(goal: SavingsGoal) {
  if (goal.target_amount <= 0) return 0;
  return Math.min(goal.current_saved / goal.target_amount, 1);
}

export function getGoalRemaining(goal: SavingsGoal) {
  return Math.max(goal.target_amount - goal.current_saved, 0);
}

export function getGoalStatus(goal: SavingsGoal) {
  if (goal.current_saved >= goal.target_amount) return "completed";
  if (goal.target_date && isPast(new Date(goal.target_date))) return "overdue";
  return "active";
}

export function getWeeklySavingsTarget(goal: SavingsGoal) {
  if (!goal.target_date) return null;

  const remaining = getGoalRemaining(goal);
  if (remaining <= 0) return 0;

  const daysLeft = differenceInCalendarDays(new Date(goal.target_date), new Date());
  if (daysLeft <= 0) return null;

  const weeksLeft = Math.max(Math.ceil(daysLeft / 7), 1);
  return remaining / weeksLeft;
}

export function groupTransactionsByType(transactions: Transaction[], type: TransactionType) {
  return transactions.filter((transaction) => transaction.type === type);
}

export function calculateBalance(transactions: Transaction[]) {
  const income = groupTransactionsByType(transactions, "income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = groupTransactionsByType(transactions, "expense").reduce((sum, item) => sum + item.amount, 0);
  return income - expenses;
}

export function getMonthlyTotals(transactions: Transaction[]) {
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());
  const monthly = transactions.filter((transaction) => {
    const current = new Date(transaction.date);
    return current >= start && current <= end;
  });

  return {
    income: groupTransactionsByType(monthly, "income").reduce((sum, item) => sum + item.amount, 0),
    expenses: groupTransactionsByType(monthly, "expense").reduce((sum, item) => sum + item.amount, 0)
  };
}

export function getMonthlySpendingSummary(transactions: Transaction[]) {
  const monthlyMap = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      const key = new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" }).format(new Date(transaction.date));
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + transaction.amount);
    });

  return [...monthlyMap.entries()].map(([month, total]) => ({ month, total }));
}

export function getCategoryBreakdown(transactions: Transaction[]) {
  const categoryMap = new Map<string, number>();

  transactions
    .filter((transaction) => transaction.type === "expense")
    .forEach((transaction) => {
      categoryMap.set(transaction.category, (categoryMap.get(transaction.category) ?? 0) + transaction.amount);
    });

  return [...categoryMap.entries()].map(([name, value]) => ({ name, value }));
}

export function getIncomeVsExpenses(transactions: Transaction[]) {
  const monthMap = new Map<string, { income: number; expenses: number }>();

  transactions.forEach((transaction) => {
    const key = new Intl.DateTimeFormat("en-US", { month: "short", year: "2-digit" }).format(new Date(transaction.date));
    const current = monthMap.get(key) ?? { income: 0, expenses: 0 };
    if (transaction.type === "income") current.income += transaction.amount;
    if (transaction.type === "expense") current.expenses += transaction.amount;
    monthMap.set(key, current);
  });

  return [...monthMap.entries()].map(([month, values]) => ({ month, ...values }));
}
