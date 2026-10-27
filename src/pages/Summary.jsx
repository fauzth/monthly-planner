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

  const byPocket = pockets
    .map((p) => ({
      name: p.name,
      color: p.color,
      value: expenses
        .filter((t) => t.pocketId === p.id)
        .reduce((s, t) => s + t.amount, 0),
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">Ringkasan</h1>

      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none"
      />

      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-xs text-gray-600">Masuk</p>
          <p className="font-semibold text-emerald-700">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="rounded-xl bg-red-50 p-3">
          <p className="text-xs text-gray-600">Keluar</p>
          <p className="font-semibold text-red-700">
            {formatCurrency(totalExpense)}
          </p>
        </div>
        <div className="rounded-xl bg-gray-100 p-3">
          <p className="text-xs text-gray-600">Sisa</p>
          <p
            className={`font-semibold ${totalIncome - totalExpense < 0 ? "text-red-700" : "text-gray-900"}`}
          >
            {formatCurrency(totalIncome - totalExpense)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">Pengeluaran per Pocket</h2>

        {byPocket.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Belum ada pengeluaran di bulan ini.
          </p>
        ) : (
          <>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byPocket}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {byPocket.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <ul className="mt-2 space-y-2">
              {byPocket.map((d) => (
                <li
                  key={d.name}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    {d.name}
                  </span>
                  <span className="text-gray-600">
                    {formatCurrency(d.value)}{" "}
                    <span className="text-xs text-gray-400">
                      ({Math.round((d.value / totalExpense) * 100)}%)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
