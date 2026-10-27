export default function PocketProgress({ allocated, spent }) {
  const remaining = allocated - spent;
  const remainingPct = allocated > 0 ? (remaining / allocated) * 100 : 0;
  const usedPct = Math.min(100, Math.max(0, 100 - remainingPct));

  const barColor =
    remainingPct > 50
      ? "bg-emerald-500"
      : remainingPct > 20
        ? "bg-yellow-400"
        : "bg-red-500";

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <div className={`h-full ${barColor}`} style={{ width: `${usedPct}%` }} />
    </div>
  );
}
