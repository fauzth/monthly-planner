import { formatCurrency } from "../../utils/formatCurrency";
import PocketProgress from "./PocketProgress";

export default function PocketCard({ pocket, onClick }) {
  const remaining = pocket.allocated - pocket.spent;

  return (
    <article
      className={`relative rounded-2xl border border-line bg-surface p-4 shadow-sm ${
        onClick
          ? "hover:bg-surface-muted active:bg-surface-muted has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary"
          : ""
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: pocket.color }}
          />
          <h3 className="min-w-0 font-semibold">
            {onClick ? (
              <button
                type="button"
                onClick={onClick}
                aria-label={`Edit pocket ${pocket.name}`}
                className="block max-w-full text-left outline-none after:absolute after:inset-0 after:rounded-2xl"
              >
                <span className="block truncate">{pocket.name}</span>
              </button>
            ) : (
              <span className="block truncate">{pocket.name}</span>
            )}
          </h3>
        </div>

        <p className="shrink-0 text-xs text-fg-muted">
          <span className="sr-only">Terpakai </span>
          {formatCurrency(pocket.spent)}
          <span aria-hidden="true"> / </span>
          <span className="sr-only"> dari </span>
          {formatCurrency(pocket.allocated)}
        </p>
      </div>

      <PocketProgress allocated={pocket.allocated} spent={pocket.spent} />

      <p className="mt-2 text-sm text-fg-muted">
        Sisa{" "}
        <span
          className={`font-semibold ${remaining < 0 ? "text-danger" : "text-fg"}`}
        >
          {formatCurrency(remaining)}
        </span>
      </p>
    </article>
  );
}
