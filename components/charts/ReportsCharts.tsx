"use client";

import { BarChart, Bar, CartesianGrid, Legend, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, LineChart, Line } from "recharts";

import type { CurrencyCode } from "~/lib/types";

const palette = ["#c8f73e", "#a8d422", "#83f5d7", "#ffcf87", "#ff9f9f", "#d8d8d8"];

export function ReportsCharts({
  monthlySpending,
  categoryBreakdown,
  incomeVsExpenses,
  currency
}: {
  monthlySpending: { month: string; total: number }[];
  categoryBreakdown: { name: string; value: number }[];
  incomeVsExpenses: { month: string; income: number; expenses: number }[];
  currency: CurrencyCode;
}) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  });
  const formatValue = (value: number | string | ReadonlyArray<number | string> | undefined) => {
    const numeric = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
    return formatter.format(numeric);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="surface-card p-5">
        <h3 className="font-sans text-xl font-extrabold uppercase">Monthly spending</h3>
        <div className="mt-6 h-64 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySpending}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="month" stroke="#6e6b62" />
              <YAxis stroke="#6e6b62" tickFormatter={(value) => formatValue(value)} />
              <Tooltip formatter={(value) => formatValue(value)} />
              <Bar dataKey="total" fill="#c8f73e" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="surface-card p-5">
        <h3 className="font-sans text-xl font-extrabold uppercase">Spending by category</h3>
        <div className="mt-6 h-64 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryBreakdown} dataKey="value" nameKey="name" innerRadius={72} outerRadius={108}>
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={entry.name} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatValue(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="surface-card p-5 xl:col-span-2">
        <h3 className="font-sans text-xl font-extrabold uppercase">Income vs expenses</h3>
        <div className="mt-6 h-64 sm:h-72 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={incomeVsExpenses}>
              <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
              <XAxis dataKey="month" stroke="#6e6b62" />
              <YAxis stroke="#6e6b62" tickFormatter={(value) => formatValue(value)} />
              <Tooltip formatter={(value) => formatValue(value)} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#83f5d7" strokeWidth={3} />
              <Line type="monotone" dataKey="expenses" stroke="#ff9f9f" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
