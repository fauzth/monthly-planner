export default function PocketProgress({ allocated, spent }) {
  // alokasi 0 dan belum ada pengeluaran dianggap kosong (bukan merah penuh)
  const remainingPct =
    allocated > 0
      ? ((allocated - spent) / allocated) * 100
      : spent > 0
        ? 0
        : 100;
  const usedPct = Math.min(100, Math.max(0, 100 - remainingPct));
  const used = Math.round(usedPct);

  const barColor =
    remainingPct > 50 ? "bg-ok" : remainingPct > 20 ? "bg-warn" : "bg-bad";

  return (
    <div
      role="progressbar"
      aria-label="Pemakaian pocket"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={used}
      aria-valuetext={`Terpakai ${used} persen`}
      className="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
    >
      <div className={`h-full ${barColor}`} style={{ width: `${usedPct}%` }} />
    </div>
  );
}
