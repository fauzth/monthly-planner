import { useCallback, useEffect, useMemo, useState } from "react";
import { FinanceContext } from "./FinanceContext";
import { getPocketStats } from "../utils/calculateBalance";
import { todayStr } from "../utils/formatDate";
import { newId } from "../utils/id";

const STORAGE_KEY = "monthly-planner-data";

const seed = {
  pockets: [
    { id: "p1", name: "Makan", allocated: 1500000, color: "#f59e0b" },
    { id: "p2", name: "Transport", allocated: 500000, color: "#3b82f6" },
    { id: "p3", name: "Tabungan", allocated: 1000000, color: "#10b981" },
  ],
  transactions: [
    {
      id: "t1",
      type: "income",
      amount: 5000000,
      note: "Gaji bulanan",
      date: todayStr(),
    },
    {
      id: "t2",
      type: "expense",
      amount: 35000,
      pocketId: "p1",
      note: "Makan siang",
      date: todayStr(),
    },
  ],
};

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
};

export function FinanceProvider({ children }) {
  const [data, setData] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // abaikan kalau storage penuh/diblokir
    }
  }, [data]);

  const addPocket = useCallback(
    (pocket) =>
      setData((d) => ({
        ...d,
        pockets: [...d.pockets, { id: newId(), ...pocket }],
      })),
    [],
  );

  const updatePocket = useCallback(
    (id, changes) =>
      setData((d) => ({
        ...d,
        pockets: d.pockets.map((p) => (p.id === id ? { ...p, ...changes } : p)),
      })),
    [],
  );

  const archivePocket = useCallback(
    (id) => updatePocket(id, { archived: true }),
    [updatePocket],
  );

  const restorePocket = useCallback(
    (id) => updatePocket(id, { archived: false }),
    [updatePocket],
  );

  const addTransaction = useCallback(
    (tx) =>
      setData((d) => ({
        ...d,
        transactions: [{ id: newId(), ...tx }, ...d.transactions],
      })),
    [],
  );

  const updateTransaction = useCallback(
    (id, tx) =>
      setData((d) => ({
        ...d,
        transactions: d.transactions.map((t) =>
          t.id === id ? { id, ...tx } : t,
        ),
      })),
    [],
  );

  const deleteTransaction = useCallback(
    (id) =>
      setData((d) => ({
        ...d,
        transactions: d.transactions.filter((t) => t.id !== id),
      })),
    [],
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
      pockets,
      transactions,
      pocketStats,
      activePocketStats,
      archivedPocketStats,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      unallocated: totalIncome - committed,
      addPocket,
      updatePocket,
      archivePocket,
      restorePocket,
      addTransaction,
      updateTransaction,
      deleteTransaction,
    };
  }, [
    data,
    addPocket,
    updatePocket,
    archivePocket,
    restorePocket,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  ]);

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}
