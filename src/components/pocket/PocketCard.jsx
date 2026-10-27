import { formatCurrency } from "../../utils/formatCurrency";
import PocketProgress from "./PocketProgress";

export default function PocketCard({ pocket, onClick }) {
  const remaining = pocket.allocated - pocket.spent;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl bg-white p-4 shadow-sm ${onClick ? "cursor-pointer active:bg-gray-50" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: pocket.color }}
          />
          <h3 className="truncate font-semibold">{pocket.name}</h3>
        </div>
        <span className="shrink-0 text-xs text-gray-500">
          {formatCurrency(pocket.spent)} / {formatCurrency(pocket.allocated)}
        </span>
      </div>

      <PocketProgress allocated={pocket.allocated} spent={pocket.spent} />

      <p className="mt-2 text-sm text-gray-600">
        Sisa{" "}
        <span
          className={`font-semibold ${remaining < 0 ? "text-red-600" : "text-gray-900"}`}
        >
          {formatCurrency(remaining)}
        </span>
      </p>
    </div>
  );
}
