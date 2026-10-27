export default function PocketProgress({ allocated, spent }) {
  // bar menunjukkan SISA jatah: penuh = masih banyak, kosong = habis
  const remainingPct =
    allocated > 0 ? ((allocated - spent) / allocated) * 100 : 0;
  const width = Math.min(100, Math.max(0, remainingPct));
  const left = Math.round(width);

  const barColor =
    remainingPct > 50 ? "bg-ok" : remainingPct > 20 ? "bg-warn" : "bg-bad";

  return (
    <div
      role="progressbar"
      aria-label="Sisa pocket"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={left}
      aria-valuetext={`Sisa ${left} persen`}
      className="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
    >
      <div
        className={`h-full transition-[width] duration-300 ${barColor}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
