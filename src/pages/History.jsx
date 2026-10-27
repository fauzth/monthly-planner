import { useState } from "react";
import TransactionItem from "../components/transaction/TransactionItem";
import EmptyState from "../components/ui/EmptyState";
import { useFinance } from "../hooks/useFinance";
import { formatCurrency } from "../utils/formatCurrency";
import { todayStr } from "../utils/formatDate";

const field =
  "w-full rounded-xl border border-line bg-surface p-3 text-sm outline-none focus:ring-2 focus:ring-primary";

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

  const stats = [
    {
      label: "Masuk",
      value: sum("income"),
      box: "bg-primary-soft",
      text: "text-primary-soft-fg",
    },
    {
      label: "Keluar",
      value: sum("expense"),
      box: "bg-danger-soft",
      text: "text-danger-soft-fg",
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <title>History | Monthly Planner</title>
      <h1 className="text-xl font-bold">History</h1>

      <div
        role="search"
        aria-label="Filter transaksi"
        className="grid grid-cols-2 gap-2"
      >
        <div>
          <label htmlFor="history-month" className="sr-only">
            Bulan
          </label>
          <input
            id="history-month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className={field}
          />
        </div>
        <div>
          <label htmlFor="history-pocket" className="sr-only">
            Filter pocket
          </label>
          <select
            id="history-pocket"
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
      </div>

      <dl className="grid grid-cols-1 gap-2 text-sm min-[420px]:grid-cols-2">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-3 ${s.box}`}>
            <dt className="text-xs text-fg-muted">{s.label}</dt>
            <dd className={`font-semibold ${s.text}`}>
              {formatCurrency(s.value)}
            </dd>
          </div>
        ))}
      </dl>

      {/* diumumkan ke screen reader setiap filter berubah */}
      <p role="status" className="sr-only">
        {filtered.length} transaksi ditemukan
      </p>

      <section aria-labelledby="history-list-title">
        <h2 id="history-list-title" className="sr-only">
          Daftar transaksi
        </h2>

        {filtered.length === 0 ? (
          transactions.length === 0 ? (
            <EmptyState
              icon="🧾"
              title="Belum ada transaksi"
              description="Catat pemasukan atau pengeluaran pertama lu."
              actionLabel="Catat transaksi"
              actionTo="/add"
            />
          ) : (
            <EmptyState
              icon="🔍"
              title="Tidak ada hasil"
              description="Coba ganti bulan atau filter pocket."
            />
          )
        ) : (
          <ul className="space-y-3">
            {filtered.map((t) => (
              <li key={t.id}>
                <TransactionItem tx={t} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
