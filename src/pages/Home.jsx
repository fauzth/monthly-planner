import { LogOut } from "lucide-react";
import PocketCard from "../components/pocket/PocketCard";
import EmptyState from "../components/ui/EmptyState";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../hooks/useAuth";
import { useFinance } from "../hooks/useFinance";
import { signOut } from "../services/authService";
import { formatCurrency } from "../utils/formatCurrency";

export default function Home() {
  const {
    activePocketStats: pocketStats,
    totalIncome,
    totalExpense,
    balance,
    unallocated,
  } = useFinance();
  const { user } = useAuth();

  const stats = [
    { label: "Pemasukan", value: totalIncome },
    { label: "Terpakai", value: totalExpense },
    { label: "Belum dialokasi", value: unallocated },
  ];

  return (
    <div className="space-y-4 p-4">
      <title>Beranda | Monthly Planner</title>
      <h1 className="sr-only">Beranda</h1>

      <header className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm text-fg-muted">{user?.email}</p>

        <div className="flex shrink-0 items-center gap-4">
          <ThemeToggle />
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-1 text-sm text-fg-muted"
          >
            <LogOut size={16} aria-hidden="true" /> Keluar
          </button>
        </div>
      </header>

      <section
        aria-labelledby="balance-title"
        className="rounded-2xl bg-primary p-5 text-on-primary"
      >
        <h2 id="balance-title" className="text-sm opacity-90">
          Total Saldo
        </h2>
        <p className="text-3xl font-bold">{formatCurrency(balance)}</p>

        <dl className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-2 text-xs">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="opacity-90">{s.label}</dt>
              <dd className="font-semibold">{formatCurrency(s.value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="pockets-title" className="space-y-3">
        <h2 id="pockets-title" className="font-semibold">
          Pocket
        </h2>

        {pocketStats.length === 0 ? (
          <EmptyState
            icon="👛"
            title="Belum ada pocket"
            description="Buat pocket untuk memisahkan keperluan pengeluaran lu."
            actionLabel="Buat pocket"
            actionTo="/pockets"
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {pocketStats.map((p) => (
              <li key={p.id}>
                <PocketCard pocket={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
