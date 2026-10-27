import { useState } from "react";
import TransactionItem from "../components/transaction/TransactionItem";
import { useFinance } from "../hooks/useFinance";
import { formatCurrency } from "../utils/formatCurrency";
import { todayStr } from "../utils/formatDate";

const field =
  "w-full rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none";

export default function History() {
  const { transactions, pockets } = useFinance();
  const [month, setMonth] = useState(todayStr().slice(0, 7));
  const [pocketId, setPocketId] = useState("");

  const filtered = transactions
    .filter((t) => !month || t.date.slice(0, 7) === month)
    .filter(
      (t) =>
        !pocketId ||
        t.pocketId === pocketId ||
        t.fromPocketId === pocketId ||
        t.toPocketId === pocketId,
    )
    .sort((a, b) => b.date.localeCompare(a.date));

  const sum = (type) =>
    filtered.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">History</h1>

      <div className="grid grid-cols-2 gap-2">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={field}
        />
        <select
          value={pocketId}
          onChange={(e) => setPocketId(e.target.value)}
          className={field}
        >
          <option value="">Semua pocket</option>
          {pockets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="text-gray-600">Masuk</p>
          <p className="font-semibold text-emerald-700">
            {formatCurrency(sum("income"))}
          </p>
        </div>
        <div className="rounded-xl bg-red-50 p-3">
          <p className="text-gray-600">Keluar</p>
          <p className="font-semibold text-red-700">
            {formatCurrency(sum("expense"))}
          </p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">
          Belum ada transaksi.
        </p>
      ) : (
        filtered.map((t) => <TransactionItem key={t.id} tx={t} />)
      )}
    </div>
  );
}
