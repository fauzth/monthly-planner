import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useFinance } from "../hooks/useFinance";
import { formatCurrency } from "../utils/formatCurrency";
import { todayStr } from "../utils/formatDate";

export default function Summary() {
  const { transactions, pockets } = useFinance();
  const [month, setMonth] = useState(todayStr().slice(0, 7));

  const monthTx = transactions.filter((t) => t.date.slice(0, 7) === month);

  const totalIncome = monthTx
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const expenses = monthTx.filter((t) => t.type === "expense");
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const byPocket = pockets
    .map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      value: expenses
        .filter((t) => t.pocketId === p.id)
        .reduce((s, t) => s + t.amount, 0),
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const stats = [
    {
      label: "Masuk",
      value: totalIncome,
      box: "bg-primary-soft",
      text: "text-primary-soft-fg",
    },
    {
      label: "Keluar",
      value: totalExpense,
      box: "bg-danger-soft",
      text: "text-danger-soft-fg",
    },
    {
      label: "Sisa",
      value: balance,
      box: "bg-surface-muted",
      text: balance < 0 ? "text-danger-soft-fg" : "text-fg",
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">Ringkasan</h1>

      <div>
        <label
          htmlFor="summary-month"
          className="mb-1 block text-sm text-fg-muted"
        >
          Bulan
        </label>
        <input
          id="summary-month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full rounded-xl border border-line bg-surface p-3 outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <dl className="grid grid-cols-1 gap-2 text-sm min-[420px]:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-3 ${s.box}`}>
            <dt className="text-xs text-fg-muted">{s.label}</dt>
            <dd className={`font-semibold ${s.text}`}>
              {formatCurrency(s.value)}
            </dd>
          </div>
        ))}
      </dl>

      <section
        aria-labelledby="pocket-chart-title"
        className="rounded-2xl border border-line bg-surface p-4 shadow-sm"
      >
        <h2 id="pocket-chart-title" className="mb-2 font-semibold">
          Pengeluaran per Pocket
        </h2>

        {byPocket.length === 0 ? (
          <p className="py-8 text-center text-sm text-fg-muted">
            Belum ada pengeluaran di bulan ini.
          </p>
        ) : (
          <>
            {/* chart bersifat visual saja; datanya sudah ada di daftar di bawah */}
            <div className="h-56" aria-hidden="true">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byPocket}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    stroke="var(--color-surface)"
                  >
                    {byPocket.map((d) => (
                      <Cell key={d.id} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatCurrency(v)}
                    contentStyle={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 12,
                      color: "var(--color-fg)",
                    }}
                    itemStyle={{ color: "var(--color-fg)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="mt-2 space-y-2">
              {byPocket.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="truncate">{d.name}</span>
                  </span>
                  <span className="shrink-0 text-fg-muted">
                    {formatCurrency(d.value)}{" "}
                    <span className="text-xs">
                      ({Math.round((d.value / totalExpense) * 100)}%)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
