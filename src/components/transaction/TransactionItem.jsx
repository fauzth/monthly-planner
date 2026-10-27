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
    amountClass = "text-primary";
  } else if (tx.type === "expense") {
    title = name(tx.pocketId);
    sub = "Pengeluaran";
    amountText = `- ${formatCurrency(tx.amount)}`;
    amountClass = "text-danger";
  } else {
    title = `${name(tx.fromPocketId)} → ${name(tx.toPocketId)}`;
    sub = "Transfer";
    amountText = formatCurrency(tx.amount);
    amountClass = "text-fg-muted";
  }

  const handleDelete = () => {
    setConfirming(false);
    deleteTransaction(tx.id);
  };

  return (
    <>
      <article className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-4 shadow-sm">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{title}</h3>
          <p className="text-xs text-fg-muted">
            {sub} · <time dateTime={tx.date}>{formatDate(tx.date)}</time>
          </p>
          {tx.note && (
            <p className="mt-1 truncate text-sm text-fg-muted">{tx.note}</p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className={`font-semibold ${amountClass}`}>{amountText}</p>
          <div className="mt-1 flex justify-end gap-2 text-xs">
            <Link
              to={`/edit/${tx.id}`}
              aria-label={`Edit transaksi ${title}`}
              className="px-1 py-1 text-primary"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              aria-label={`Hapus transaksi ${title}`}
              className="px-1 py-1 text-fg-muted"
            >
              Hapus
            </button>
          </div>
        </div>
      </article>

      <ConfirmDialog
        open={confirming}
        title="Hapus transaksi?"
        message={`${title} sebesar ${formatCurrency(tx.amount)} akan dihapus dan saldo pocket dihitung ulang.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
