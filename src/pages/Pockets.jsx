import { useState } from "react";
import { Plus } from "lucide-react";
import Modal from "../components/ui/Modal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
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
    usedPocketIds,
    addPocket,
    updatePocket,
    archivePocket,
    restorePocket,
    deletePocket,
  } = useFinance();

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const close = () => {
    setAdding(false);
    setEditing(null);
    setConfirmArchive(false);
    setConfirmDelete(false);
  };

  const handleSubmit = (data) => {
    if (editing) updatePocket(editing.id, data);
    else addPocket(data);
    close();
  };

  const handleArchive = () => {
    archivePocket(editing.id);
    close();
  };

  const maxAmount = editing ? unallocated + editing.baseAllocated : unallocated;

  return (
    <div className="space-y-4 p-4">
      <title>Pocket | Monthly Planner</title>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold">Pocket</h1>
        <button
          type="button"
          onClick={() => setAdding(true)}
          aria-label="Tambah pocket"
          className="flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-hover"
        >
          <Plus size={16} aria-hidden="true" /> Pocket
        </button>
      </div>

      <p className="text-sm text-fg-muted">
        Belum dialokasikan:{" "}
        <span
          className={`font-semibold ${unallocated < 0 ? "text-danger" : "text-fg"}`}
        >
          {formatCurrency(unallocated)}
        </span>
      </p>

      <section aria-labelledby="active-pockets-title">
        <h2 id="active-pockets-title" className="sr-only">
          Pocket aktif
        </h2>

        {activePocketStats.length === 0 ? (
          <EmptyState
            icon="👛"
            title="Belum ada pocket"
            description="Bagi gaji lu ke pocket, misalnya Makan, Transport, atau Tabungan."
            actionLabel="Buat pocket pertama"
            onAction={() => setAdding(true)}
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {activePocketStats.map((p) => (
              <li key={p.id}>
                <PocketCard pocket={p} onClick={() => setEditing(p)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {archivedPocketStats.length > 0 && (
        <section>
          <button
            type="button"
            onClick={() => setShowArchived((v) => !v)}
            aria-expanded={showArchived}
            aria-controls="archived-pockets"
            className="text-sm text-fg-muted underline-offset-2 hover:underline"
          >
            {showArchived ? "Sembunyikan" : "Tampilkan"} arsip (
            {archivedPocketStats.length})
          </button>

          <ul
            id="archived-pockets"
            hidden={!showArchived}
            className="mt-2 space-y-2"
          >
            {archivedPocketStats.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-surface-muted p-3 text-sm"
              >
                <span className="min-w-0 truncate text-fg-muted">{p.name}</span>
                <button
                  type="button"
                  onClick={() => restorePocket(p.id)}
                  aria-label={`Pulihkan pocket ${p.name}`}
                  className="shrink-0 font-semibold text-primary"
                >
                  Pulihkan
                </button>
              </li>
            ))}
          </ul>
        </section>
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
          canDelete={editing ? !usedPocketIds.has(editing.id) : false}
          onSubmit={handleSubmit}
          onArchive={() => setConfirmArchive(true)}
          onDelete={() => setConfirmDelete(true)}
        />
      </Modal>

      <ConfirmDialog
        open={confirmArchive}
        title="Arsipkan pocket?"
        message={`Pocket "${editing?.name}" akan disembunyikan. Sisa saldonya kembali ke belum dialokasikan, dan riwayat transaksinya tetap tersimpan.`}
        confirmLabel="Arsipkan"
        onConfirm={handleArchive}
        onCancel={() => setConfirmArchive(false)}
      />

      <ConfirmDialog
        open={confirmDelete}
        title="Hapus pocket permanen?"
        message={`Pocket "${editing?.name}" belum punya transaksi dan akan dihapus selamanya. Tindakan ini tidak bisa dibatalkan.`}
        onConfirm={() => {
          deletePocket(editing.id);
          close();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
