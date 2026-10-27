import { useState } from "react";
import Modal from "../components/ui/Modal";
import PocketCard from "../components/pocket/PocketCard";
import PocketForm from "../components/pocket/PocketForm";
import { useFinance } from "../hooks/useFinance";
import { formatCurrency } from "../utils/formatCurrency";

export default function Pockets() {
  const {
    activePocketStats,
    archivedPocketStats,
    totalIncome,
    unallocated,
    addPocket,
    updatePocket,
    archivePocket,
    restorePocket,
  } = useFinance();

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showArchived, setShowArchived] = useState(false);

  const close = () => {
    setAdding(false);
    setEditing(null);
  };

  const handleSubmit = (data) => {
    if (editing) updatePocket(editing.id, data);
    else addPocket(data);
    close();
  };

  const handleArchive = () => {
    if (
      confirm(
        `Arsipkan pocket "${editing.name}"? Sisa saldonya kembali ke belum dialokasikan.`,
      )
    ) {
      archivePocket(editing.id);
      close();
    }
  };

  const maxAmount = editing ? unallocated + editing.baseAllocated : unallocated;

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Pocket</h1>
        <button
          onClick={() => setAdding(true)}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          + Pocket
        </button>
      </div>

      <p className="text-sm text-gray-600">
        Belum dialokasikan:{" "}
        <span
          className={`font-semibold ${unallocated < 0 ? "text-red-600" : ""}`}
        >
          {formatCurrency(unallocated)}
        </span>
      </p>

      {activePocketStats.length === 0 && (
        <p className="py-10 text-center text-sm text-gray-500">
          Belum ada pocket. Tekan + Pocket untuk mulai.
        </p>
      )}

      {activePocketStats.map((p) => (
        <PocketCard key={p.id} pocket={p} onClick={() => setEditing(p)} />
      ))}

      {archivedPocketStats.length > 0 && (
        <div>
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="text-sm text-gray-500"
          >
            {showArchived ? "Sembunyikan" : "Tampilkan"} arsip (
            {archivedPocketStats.length})
          </button>

          {showArchived && (
            <div className="mt-2 space-y-2">
              {archivedPocketStats.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-gray-100 p-3 text-sm"
                >
                  <span className="text-gray-600">{p.name}</span>
                  <button
                    onClick={() => restorePocket(p.id)}
                    className="font-semibold text-emerald-600"
                  >
                    Pulihkan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal
        open={adding || !!editing}
        onClose={close}
        title={editing ? "Edit Pocket" : "Pocket Baru"}
      >
        <PocketForm
          initial={editing}
          maxAmount={maxAmount}
          totalIncome={totalIncome}
          onSubmit={handleSubmit}
          onArchive={handleArchive}
        />
      </Modal>
    </div>
  );
}
