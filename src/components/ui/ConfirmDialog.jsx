import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  danger = true,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="mb-5 text-sm text-gray-600">{message}</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onCancel}
          className="rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-600"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          className={`rounded-xl py-3 text-sm font-semibold text-white ${
            danger
              ? "bg-red-600 active:bg-red-700"
              : "bg-emerald-600 active:bg-emerald-700"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
