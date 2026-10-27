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
  "w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-500";

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
        <p className="text-sm text-gray-600">Transaksi tidak ditemukan.</p>
        <Link to="/history" className="font-semibold text-emerald-600">
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
      <h1 className="text-xl font-bold">
        {isEdit ? "Edit Transaksi" : "Catat Transaksi"}
      </h1>

      <div className="grid grid-cols-3 gap-1 rounded-xl bg-gray-200 p-1">
        {TYPES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => changeType(t.key)}
            disabled={isEdit && type !== t.key}
            className={`rounded-lg py-2 text-sm font-medium ${
              type === t.key ? "bg-white shadow-sm" : "text-gray-600"
            } ${isEdit && type !== t.key ? "opacity-40" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {needPocket && options.length === 0 ? (
        <p className="rounded-xl bg-white p-4 text-sm text-gray-600">
          Belum ada pocket.{" "}
          <Link to="/pockets" className="font-semibold text-emerald-600">
            Buat pocket dulu
          </Link>
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Nominal</label>
            <CurrencyInput value={amount} onChange={setAmount} />
          </div>

          {type === "income" && (
            <p className="text-sm text-gray-500">
              Pemasukan masuk ke saldo utama.
            </p>
          )}

          {needPocket && (
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                {type === "transfer" ? "Dari pocket" : "Pocket"}
              </label>
              <select
                value={pocketId}
                onChange={(e) => setPocketId(e.target.value)}
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
                <p className="mt-1 text-xs text-red-600">
                  Melebihi sisa pocket ({formatCurrency(remaining)}), saldo akan
                  minus.
                </p>
              )}
            </div>
          )}

          {type === "transfer" && (
            <div>
              <label className="mb-1 block text-sm text-gray-600">
                Ke pocket
              </label>
              <select
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
            <label className="mb-1 block text-sm text-gray-600">
              Catatan (opsional)
            </label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="contoh: makan siang"
              className={field}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={field}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white active:bg-emerald-700"
          >
            {isEdit ? "Simpan Perubahan" : "Simpan"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-600"
            >
              Batal
            </button>
          )}
        </form>
      )}
    </div>
  );
}
