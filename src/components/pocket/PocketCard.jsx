import { formatCurrency } from "../../utils/formatCurrency";
import PocketProgress from "./PocketProgress";

export default function PocketCard({ pocket }) {
  const remaining = pocket.allocated - pocket.spent;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: pocket.color }}
          />
          <h3 className="font-semibold">{pocket.name}</h3>
        </div>
        <span className="text-xs text-gray-500">
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
