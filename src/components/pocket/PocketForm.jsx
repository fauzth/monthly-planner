import { useState } from "react";
import CurrencyInput from "../ui/CurrencyInput";
import { formatCurrency } from "../../utils/formatCurrency";

const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

const field =
  "w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-500";

export default function PocketForm({
  initial,
  maxAmount,
  totalIncome,
  onSubmit,
  onArchive,
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [nominal, setNominal] = useState(initial?.baseAllocated ?? 0);
  const [color, setColor] = useState(initial?.color ?? COLORS[0]);
  const [mode, setMode] = useState("nominal");
  const [percent, setPercent] = useState("");
  const [error, setError] = useState("");

  const limit = Math.max(0, maxAmount);
  const amount =
    mode === "percent"
      ? Math.round((totalIncome * (Number(percent) || 0)) / 100)
      : nominal;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Nama pocket wajib diisi");
    if (amount > limit)
      return setError(`Alokasi melebihi batas (maks ${formatCurrency(limit)})`);
    onSubmit({ name: name.trim(), allocated: amount, color });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-gray-600">Nama pocket</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="contoh: Kos, Nongkrong, Dana Darurat"
          className={field}
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className="text-sm text-gray-600">Alokasi</label>
          <div className="flex gap-1 rounded-lg bg-gray-200 p-0.5 text-xs">
            {[
              ["nominal", "Rp"],
              ["percent", "%"],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`rounded-md px-3 py-1 ${mode === key ? "bg-white shadow-sm" : "text-gray-600"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === "nominal" ? (
          <CurrencyInput value={nominal} onChange={setNominal} />
        ) : (
          <>
            <div className="flex items-center rounded-xl border border-gray-300 bg-white px-3 focus-within:ring-2 focus-within:ring-emerald-500">
              <input
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent p-3 outline-none"
              />
              <span className="text-gray-500">%</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              = {formatCurrency(amount)} dari total pemasukan{" "}
              {formatCurrency(totalIncome)}
            </p>
          </>
        )}

        <p className="mt-1 text-xs text-gray-500">
          Maksimal bisa dialokasikan: {formatCurrency(limit)}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-600">Warna</label>
        <div className="flex gap-3">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`h-8 w-8 rounded-full ${color === c ? "ring-2 ring-offset-2 ring-gray-800" : ""}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white active:bg-emerald-700"
      >
        {initial ? "Simpan Perubahan" : "Simpan Pocket"}
      </button>

      {initial && (
        <button
          type="button"
          onClick={onArchive}
          className="w-full rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600"
        >
          Arsipkan Pocket
        </button>
      )}
    </form>
  );
}
