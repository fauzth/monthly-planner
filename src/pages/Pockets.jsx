import { useState } from "react";
import Modal from "../components/ui/Modal";
import PocketCard from "../components/pocket/PocketCard";
import PocketForm from "../components/pocket/PocketForm";
import { useFinance } from "../hooks/useFinance";

export default function Pockets() {
  const { pocketStats, addPocket } = useFinance();
  const [open, setOpen] = useState(false);

  const handleAdd = (data) => {
    addPocket(data);
    setOpen(false);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Pocket</h1>
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
        >
          + Pocket
        </button>
      </div>

      {pocketStats.map((p) => (
        <PocketCard key={p.id} pocket={p} />
      ))}

      <Modal open={open} onClose={() => setOpen(false)} title="Pocket Baru">
        <PocketForm onSubmit={handleAdd} />
      </Modal>
    </div>
  );
}
