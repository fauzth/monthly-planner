import { useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../ui/ConfirmDialog";
import { useFinance } from "../../hooks/useFinance";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function TransactionItem({ tx }) {
  const { pockets, deleteTransaction } = useFinance();
  const [confirming, setConfirming] = useState(false);
  const name = (id) =>
    pockets.find((p) => p.id === id)?.name ?? "Pocket dihapus";

  let title, sub, amountText, amountClass;
  if (tx.type === "income") {
    title = "Pemasukan";
    sub = "Saldo utama";
    amountText = `+ ${formatCurrency(tx.amount)}`;
    amountClass = "text-emerald-600";
  } else if (tx.type === "expense") {
    title = name(tx.pocketId);
    sub = "Pengeluaran";
    amountText = `- ${formatCurrency(tx.amount)}`;
    amountClass = "text-red-600";
  } else {
    title = `${name(tx.fromPocketId)} → ${name(tx.toPocketId)}`;
    sub = "Transfer";
    amountText = formatCurrency(tx.amount);
    amountClass = "text-gray-600";
  }

  return (
    <>
      <div className="flex items-start justify-between rounded-2xl bg-white p-4 shadow-sm">
        <div className="min-w-0">
          <p className="truncate font-medium">{title}</p>
          <p className="text-xs text-gray-500">
            {sub} · {formatDate(tx.date)}
          </p>
          {tx.note && (
            <p className="mt-1 truncate text-sm text-gray-600">{tx.note}</p>
          )}
        </div>
        <div className="ml-3 shrink-0 text-right">
          <p className={`font-semibold ${amountClass}`}>{amountText}</p>
          <div className="mt-1 flex justify-end gap-3 text-xs">
            <Link to={`/edit/${tx.id}`} className="text-emerald-600">
              Edit
            </Link>
            <button
              onClick={() => setConfirming(true)}
              className="text-gray-400"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Hapus transaksi?"
        message={`${title} sebesar ${formatCurrency(tx.amount)} akan dihapus dan saldo pocket dihitung ulang.`}
        onConfirm={() => deleteTransaction(tx.id)}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
