import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import CurrencyInput from "../components/ui/CurrencyInput";
import { useFinance } from "../hooks/useFinance";
import { formatCurrency } from "../utils/formatCurrency";
import { todayStr } from "../utils/formatDate";

const TYPES = [
  { key: "expense", label: "Pengeluaran" },
  { key: "income", label: "Pemasukan" },
  { key: "transfer", label: "Transfer" },
];

const field =
  "w-full rounded-xl border border-line bg-surface p-3 outline-none focus:ring-2 focus:ring-primary";
const label = "mb-1 block text-sm text-fg-muted";

export default function AddTransaction() {
  const { pocketStats, transactions, addTransaction, updateTransaction } =
    useFinance();
  const navigate = useNavigate();
  const { id } = useParams();
  const [params] = useSearchParams();

  const editing = id ? transactions.find((t) => t.id === id) : null;
  const isEdit = !!id;

  const paramType = params.get("type");
  const [type, setType] = useState(
    editing?.type ??
      (TYPES.some((t) => t.key === paramType) ? paramType : "expense"),
  );
  const [amount, setAmount] = useState(editing?.amount ?? 0);
  const [pocketId, setPocketId] = useState(
    editing?.pocketId ?? editing?.fromPocketId ?? "",
  );
  const [toPocketId, setToPocketId] = useState(editing?.toPocketId ?? "");
  const [note, setNote] = useState(editing?.note ?? "");
  const [date, setDate] = useState(editing?.date ?? todayStr());
  const [error, setError] = useState("");

  if (isEdit && !editing) {
    return (
      <div className="space-y-3 p-4">
        <title>Transaksi tidak ditemukan | Monthly Planner</title>
        <p className="text-sm text-fg-muted">Transaksi tidak ditemukan.</p>
        <Link to="/history" className="font-semibold text-primary">
          Kembali ke History
        </Link>
      </div>
    );
  }

  // pocket aktif + pocket arsip yang masih dipakai transaksi ini
  const options = pocketStats.filter(
    (p) =>
      !p.archived ||
      p.id === editing?.pocketId ||
      p.id === editing?.fromPocketId ||
      p.id === editing?.toPocketId,
  );

  const source = pocketStats.find((p) => p.id === pocketId);

  // saat edit, nominal lama transaksi ini dikembalikan dulu ke sisa saldo
  const ownAmount =
    editing &&
    ((editing.type === "expense" && editing.pocketId === pocketId) ||
      (editing.type === "transfer" && editing.fromPocketId === pocketId))
      ? editing.amount
      : 0;
  const remaining = source ? source.allocated - source.spent + ownAmount : 0;

  const overspend = type === "expense" && source && amount > remaining;
  const needPocket = type !== "income";
  const pageTitle = isEdit ? "Edit Transaksi" : "Catat Transaksi";

  const changeType = (t) => {
    if (isEdit) return;
    setType(t);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) return setError("Nominal harus lebih dari 0");

    let tx;
    if (type === "income") {
      tx = { type, amount, note: note.trim(), date };
    }

    if (type === "expense") {
      if (!pocketId) return setError("Pilih pocket dulu");
      tx = { type, amount, pocketId, note: note.trim(), date };
    }

    if (type === "transfer") {
      if (!pocketId || !toPocketId)
        return setError("Pilih pocket asal dan tujuan");
      if (pocketId === toPocketId)
        return setError("Pocket asal dan tujuan tidak boleh sama");
      if (amount > remaining)
        return setError("Sisa saldo pocket asal tidak cukup");
      tx = {
        type,
        amount,
        fromPocketId: pocketId,
        toPocketId,
        note: note.trim(),
        date,
      };
    }

    if (isEdit) updateTransaction(id, tx);
    else addTransaction(tx);

    navigate("/history");
  };

  return (
    <div className="space-y-4 p-4 md:max-w-lg">
      <title>{`${pageTitle} | Monthly Planner`}</title>
      <h1 id="tx-title" className="text-xl font-bold">
        {pageTitle}
      </h1>

      <fieldset className="grid grid-cols-3 gap-1 rounded-xl bg-surface-muted p-1">
        <legend className="sr-only">Jenis transaksi</legend>
        {TYPES.map((t) => (
          <label key={t.key} className="relative">
            <input
              type="radio"
              name="tx-type"
              value={t.key}
              checked={type === t.key}
              onChange={() => changeType(t.key)}
              disabled={isEdit && type !== t.key}
              className="peer sr-only"
            />
            <span className="block cursor-pointer rounded-lg py-2 text-center text-sm font-medium text-fg-muted peer-checked:bg-surface peer-checked:text-fg peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-40">
              {t.label}
            </span>
          </label>
        ))}
      </fieldset>

      {needPocket && options.length === 0 ? (
        <p className="rounded-xl border border-line bg-surface p-4 text-sm text-fg-muted">
          Belum ada pocket.{" "}
          <Link to="/pockets" className="font-semibold text-primary">
            Buat pocket dulu
          </Link>
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          aria-labelledby="tx-title"
          className="space-y-4"
        >
          <div>
            <label htmlFor="tx-amount" className={label}>
              Nominal
            </label>
            <CurrencyInput id="tx-amount" value={amount} onChange={setAmount} />
          </div>

          {type === "income" && (
            <p className="text-sm text-fg-muted">
              Pemasukan masuk ke saldo utama.
            </p>
          )}

          {needPocket && (
            <div>
              <label htmlFor="tx-pocket" className={label}>
                {type === "transfer" ? "Dari pocket" : "Pocket"}
              </label>
              <select
                id="tx-pocket"
                value={pocketId}
                onChange={(e) => setPocketId(e.target.value)}
                aria-describedby={overspend ? "tx-overspend" : undefined}
                className={field}
              >
                <option value="">Pilih pocket</option>
                {options.map((p) => {
                  const own =
                    editing &&
                    ((editing.type === "expense" &&
                      editing.pocketId === p.id) ||
                      (editing.type === "transfer" &&
                        editing.fromPocketId === p.id))
                      ? editing.amount
                      : 0;
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name}
                      {p.archived ? " (arsip)" : ""} (sisa{" "}
                      {formatCurrency(p.allocated - p.spent + own)})
                    </option>
                  );
                })}
              </select>
              {overspend && (
                <p id="tx-overspend" className="mt-1 text-xs text-danger">
                  Melebihi sisa pocket ({formatCurrency(remaining)}), saldo akan
                  minus.
                </p>
              )}
            </div>
          )}

          {type === "transfer" && (
            <div>
              <label htmlFor="tx-to-pocket" className={label}>
                Ke pocket
              </label>
              <select
                id="tx-to-pocket"
                value={toPocketId}
                onChange={(e) => setToPocketId(e.target.value)}
                className={field}
              >
                <option value="">Pilih pocket tujuan</option>
                {options
                  .filter((p) => p.id !== pocketId)
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                      {p.archived ? " (arsip)" : ""}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="tx-note" className={label}>
              Catatan (opsional)
            </label>
            <input
              id="tx-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="contoh: makan siang"
              autoComplete="off"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="tx-date" className={label}>
              Tanggal
            </label>
            <input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={field}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-hover"
          >
            {isEdit ? "Simpan Perubahan" : "Simpan"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full rounded-xl border border-line py-3 text-sm font-semibold text-fg-muted"
            >
              Batal
            </button>
          )}
        </form>
      )}
    </div>
  );
}
