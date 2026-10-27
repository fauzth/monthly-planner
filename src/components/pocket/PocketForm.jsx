import { useState } from "react";
import CurrencyInput from "../ui/CurrencyInput";
import { formatCurrency } from "../../utils/formatCurrency";

const COLORS = [
  { value: "#f59e0b", name: "Kuning" },
  { value: "#3b82f6", name: "Biru" },
  { value: "#10b981", name: "Hijau" },
  { value: "#ef4444", name: "Merah" },
  { value: "#8b5cf6", name: "Ungu" },
  { value: "#ec4899", name: "Merah muda" },
  { value: "#14b8a6", name: "Tosca" },
];

const MODES = [
  { key: "nominal", symbol: "Rp", name: "Rupiah" },
  { key: "percent", symbol: "%", name: "Persen" },
];

const field =
  "w-full rounded-xl border border-line bg-surface p-3 outline-none focus:ring-2 focus:ring-primary";
const label = "mb-1 block text-sm text-fg-muted";

export default function PocketForm({
  initial,
  maxAmount,
  totalIncome,
  canDelete,
  onSubmit,
  onArchive,
  onDelete,
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [nominal, setNominal] = useState(initial?.baseAllocated ?? 0);
  const [color, setColor] = useState(initial?.color ?? COLORS[0].value);
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
        <label htmlFor="pocket-name" className={label}>
          Nama pocket
        </label>
        <input
          id="pocket-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="contoh: Kos, Nongkrong, Dana Darurat"
          autoComplete="off"
          className={field}
        />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between gap-3">
          <label htmlFor="pocket-allocation" className="text-sm text-fg-muted">
            Alokasi
          </label>

          <fieldset className="flex gap-1 rounded-lg bg-surface-muted p-0.5 text-xs">
            <legend className="sr-only">Isi alokasi dalam</legend>
            {MODES.map((m) => (
              <label key={m.key}>
                <input
                  type="radio"
                  name="alloc-mode"
                  value={m.key}
                  checked={mode === m.key}
                  onChange={() => setMode(m.key)}
                  className="peer sr-only"
                />
                <span className="block cursor-pointer rounded-md px-3 py-1 text-fg-muted peer-checked:bg-surface peer-checked:text-fg peer-checked:shadow-sm peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                  <span aria-hidden="true">{m.symbol}</span>
                  <span className="sr-only">{m.name}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>

        {mode === "nominal" ? (
          <CurrencyInput
            id="pocket-allocation"
            value={nominal}
            onChange={setNominal}
            aria-describedby="alloc-hint"
          />
        ) : (
          <>
            <div className="flex items-center rounded-xl border border-line bg-surface px-3 focus-within:ring-2 focus-within:ring-primary">
              <input
                id="pocket-allocation"
                type="number"
                inputMode="decimal"
                min="0"
                max="100"
                step="any"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                placeholder="0"
                aria-describedby="alloc-preview alloc-hint"
                className="w-full bg-transparent p-3 outline-none"
              />
              <span aria-hidden="true" className="text-fg-muted">
                %
              </span>
            </div>
            <p id="alloc-preview" className="mt-1 text-xs text-fg-muted">
              = {formatCurrency(amount)} dari total pemasukan{" "}
              {formatCurrency(totalIncome)}
            </p>
          </>
        )}

        <p id="alloc-hint" className="mt-1 text-xs text-fg-muted">
          Maksimal bisa dialokasikan: {formatCurrency(limit)}
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm text-fg-muted">Warna</legend>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((c) => (
            <label key={c.value} className="relative">
              <input
                type="radio"
                name="pocket-color"
                value={c.value}
                checked={color === c.value}
                onChange={() => setColor(c.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="block h-8 w-8 cursor-pointer rounded-full peer-checked:ring-2 peer-checked:ring-fg peer-checked:ring-offset-2 peer-checked:ring-offset-surface peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary"
                style={{ backgroundColor: c.value }}
              />
              <span className="sr-only">{c.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-primary py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-hover"
      >
        {initial ? "Simpan Perubahan" : "Simpan Pocket"}
      </button>

      {initial && (
        <button
          type="button"
          onClick={onArchive}
          className="w-full rounded-xl border border-danger/30 py-3 text-sm font-semibold text-danger"
        >
          Arsipkan Pocket
        </button>
      )}

      {initial && canDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="w-full rounded-xl py-2 text-sm text-fg-muted"
        >
          Hapus permanen
        </button>
      )}
    </form>
  );
}
