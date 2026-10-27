import PocketCard from "../components/pocket/PocketCard";
import { useFinance } from "../hooks/useFinance";
import { formatCurrency } from "../utils/formatCurrency";

export default function Home() {
  const {
    activePocketStats: pocketStats,
    totalIncome,
    totalExpense,
    balance,
    unallocated,
  } = useFinance();

  return (
    <div className="space-y-4 p-4">
      <div className="rounded-2xl bg-emerald-600 p-5 text-white">
        <p className="text-sm opacity-80">Total Saldo</p>
        <p className="text-3xl font-bold">{formatCurrency(balance)}</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="opacity-80">Pemasukan</p>
            <p className="font-semibold">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="opacity-80">Terpakai</p>
            <p className="font-semibold">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="text-right">
            <p className="opacity-80">Belum dialokasi</p>
            <p className="font-semibold">{formatCurrency(unallocated)}</p>
          </div>
        </div>
      </div>

      <h2 className="font-semibold">Pocket</h2>
      {pocketStats.map((p) => (
        <PocketCard key={p.id} pocket={p} />
      ))}
    </div>
  );
}
