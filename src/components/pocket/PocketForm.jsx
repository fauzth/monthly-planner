import { useState } from "react";
import CurrencyInput from "../ui/CurrencyInput";

const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

export default function PocketForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [allocated, setAllocated] = useState(0);
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), allocated, color });
    setName("");
    setAllocated(0);
    setColor(COLORS[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm text-gray-600">Nama pocket</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="contoh: Kos, Nongkrong, Dana Darurat"
          className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm text-gray-600">Alokasi</label>
        <CurrencyInput value={allocated} onChange={setAllocated} />
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

      <button
        type="submit"
        className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white active:bg-emerald-700"
      >
        Simpan Pocket
      </button>
    </form>
  );
}
