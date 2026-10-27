import PocketCard from "../components/pocket/PocketCard";
import { useFinance } from "../hooks/useFinance";
import { formatCurrency } from "../utils/formatCurrency";
import EmptyState from "../components/ui/EmptyState";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { signOut } from "../services/authService";

export default function Home() {
  const {
    activePocketStats: pocketStats,
    totalIncome,
    totalExpense,
    balance,
    unallocated,
  } = useFinance();

  const { user } = useAuth();
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-sm text-gray-500">{user?.email}</p>
        <button
          onClick={signOut}
          className="flex shrink-0 items-center gap-1 text-sm text-gray-500"
        >
          <LogOut size={16} /> Keluar
        </button>
      </div>
      <div className="rounded-2xl bg-emerald-600 p-5 text-white">
        <p className="text-sm opacity-80">Total Saldo</p>
        <p className="text-3xl font-bold">{formatCurrency(balance)}</p>

        <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-2 text-xs">
          <div>
            <p className="opacity-80">Pemasukan</p>
            <p className="font-semibold">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="opacity-80">Terpakai</p>
            <p className="font-semibold">{formatCurrency(totalExpense)}</p>
          </div>
          <div>
            <p className="opacity-80">Belum dialokasi</p>
            <p className="font-semibold">{formatCurrency(unallocated)}</p>
          </div>
        </div>
      </div>

      <h2 className="font-semibold">Pocket</h2>
      {pocketStats.length === 0 ? (
        <EmptyState
          icon="👛"
          title="Belum ada pocket"
          description="Buat pocket untuk memisahkan keperluan pengeluaran lu."
          actionLabel="Buat pocket"
          actionTo="/pockets"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {pocketStats.map((p) => (
            <PocketCard key={p.id} pocket={p} />
          ))}
        </div>
      )}
    </div>
  );
}
