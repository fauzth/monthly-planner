import { useId } from "react";
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
  const messageId = useId();

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      role="alertdialog"
      descriptionId={messageId}
    >
      <p id={messageId} className="mb-5 text-sm text-fg-muted">
        {message}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          data-autofocus
          onClick={onCancel}
          className="rounded-xl border border-line py-3 text-sm font-semibold text-fg hover:bg-surface-muted"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-xl py-3 text-sm font-semibold ${
            danger
              ? "bg-danger text-on-danger hover:bg-danger-hover active:bg-danger-hover"
              : "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-hover"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
