import { useCallback, useEffect, useMemo, useState } from "react";
import { FinanceContext } from "./FinanceContext";
import { useAuth } from "../hooks/useAuth";
import { getPocketStats } from "../utils/calculateBalance";
import {
  fetchPockets,
  createPocket,
  updatePocketById,
  deletePocketById,
} from "../services/pocketService";
import {
  fetchTransactions,
  createTransaction,
  updateTransactionById,
  deleteTransactionById,
} from "../services/transactionService";

const empty = { pockets: [], transactions: [] };

export function FinanceProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [store, setData] = useState({
    ownerId: null,
    pockets: [],
    transactions: [],
  });
  const [error, setError] = useState("");

  // data hanya dianggap valid kalau milik user yang sedang login
  const data = store.ownerId === userId ? store : empty;
  const loading = Boolean(userId) && store.ownerId !== userId;

  // muat data tiap kali user berganti (login / ganti akun)
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    Promise.all([fetchPockets(), fetchTransactions()])
      .then(([pockets, transactions]) => {
        if (!cancelled) setData({ ownerId: userId, pockets, transactions });
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e.message || "Gagal memuat data.");
        // tandai sudah "selesai" supaya loading tidak menggantung
        setData({ ownerId: userId, pockets: [], transactions: [] });
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // bungkus aksi: tangkap error supaya tampil sebagai banner, bukan crash
  const run = useCallback(async (fn) => {
    try {
      setError("");
      await fn();
    } catch (e) {
      setError(
        e.code === "23503"
          ? "Pocket ini masih punya transaksi, jadi tidak bisa dihapus. Arsipkan saja."
          : e.message || "Terjadi kesalahan.",
      );
    }
  }, []);

  const clearError = useCallback(() => setError(""), []);

  const addPocket = useCallback(
    (pocket) =>
      run(async () => {
        const created = await createPocket(pocket);
        setData((d) => ({ ...d, pockets: [...d.pockets, created] }));
      }),
    [run],
  );

  const updatePocket = useCallback(
    (id, changes) =>
      run(async () => {
        const updated = await updatePocketById(id, changes);
        setData((d) => ({
          ...d,
          pockets: d.pockets.map((p) => (p.id === id ? updated : p)),
        }));
      }),
    [run],
  );

  const archivePocket = useCallback(
    (id) => updatePocket(id, { archived: true }),
    [updatePocket],
  );
  const restorePocket = useCallback(
    (id) => updatePocket(id, { archived: false }),
    [updatePocket],
  );

  const deletePocket = useCallback(
    (id) =>
      run(async () => {
        await deletePocketById(id); // ditolak database kalau pocket masih punya transaksi
        setData((d) => ({
          ...d,
          pockets: d.pockets.filter((p) => p.id !== id),
        }));
      }),
    [run],
  );

  const addTransaction = useCallback(
    (tx) =>
      run(async () => {
        const created = await createTransaction(tx);
        setData((d) => ({ ...d, transactions: [created, ...d.transactions] }));
      }),
    [run],
  );

  const updateTransaction = useCallback(
    (id, tx) =>
      run(async () => {
        const updated = await updateTransactionById(id, tx);
        setData((d) => ({
          ...d,
          transactions: d.transactions.map((t) => (t.id === id ? updated : t)),
        }));
      }),
    [run],
  );

  const deleteTransaction = useCallback(
    (id) =>
      run(async () => {
        await deleteTransactionById(id);
        setData((d) => ({
          ...d,
          transactions: d.transactions.filter((t) => t.id !== id),
        }));
      }),
    [run],
  );

  const value = useMemo(() => {
    const { pockets, transactions } = data;
    const pocketStats = getPocketStats(pockets, transactions);
    const activePocketStats = pocketStats.filter((p) => !p.archived);
    const archivedPocketStats = pocketStats.filter((p) => p.archived);

    const sum = (type) =>
      transactions
        .filter((t) => t.type === type)
        .reduce((s, t) => s + t.amount, 0);

    const totalIncome = sum("income");
    const totalExpense = sum("expense");

    // dana yang "terkunci": budget pocket aktif + pengeluaran pocket arsip
    const committed =
      activePocketStats.reduce((s, p) => s + p.allocated, 0) +
      archivedPocketStats.reduce((s, p) => s + p.spent, 0);

    return {
      loading,
      error,
      clearError,
      pockets,
      transactions,
      pocketStats,
      activePocketStats,
      archivedPocketStats,
      usedPocketIds: new Set(
        transactions
          .flatMap((t) => [t.pocketId, t.fromPocketId, t.toPocketId])
          .filter(Boolean),
      ),
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      unallocated: totalIncome - committed,
      addPocket,
      updatePocket,
      archivePocket,
      restorePocket,
      deletePocket,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    };
  }, [
    data,
    loading,
    error,
    clearError,
    addPocket,
    updatePocket,
    archivePocket,
    restorePocket,
    deletePocket,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  ]);

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}
