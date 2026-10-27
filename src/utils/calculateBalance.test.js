import { describe, it, expect } from "vitest";
import { getPocketStats } from "./calculateBalance";

const pockets = [
  { id: "a", name: "Makan", allocated: 1000000 },
  { id: "b", name: "Transport", allocated: 500000 },
];

describe("getPocketStats", () => {
  it("tanpa transaksi, saldo sama dengan alokasi", () => {
    const [a] = getPocketStats(pockets, []);
    expect(a.allocated).toBe(1000000);
    expect(a.spent).toBe(0);
  });

  it("pengeluaran menambah spent pocket yang tepat", () => {
    const txs = [{ type: "expense", amount: 150000, pocketId: "a" }];
    const [a, b] = getPocketStats(pockets, txs);
    expect(a.spent).toBe(150000);
    expect(b.spent).toBe(0);
  });

  it("transfer memindahkan alokasi antar pocket tanpa mengubah total", () => {
    const txs = [
      { type: "transfer", amount: 200000, fromPocketId: "a", toPocketId: "b" },
    ];
    const [a, b] = getPocketStats(pockets, txs);
    expect(a.allocated).toBe(800000);
    expect(b.allocated).toBe(700000);
    expect(a.allocated + b.allocated).toBe(1500000);
  });

  it("pemasukan tidak mempengaruhi pocket", () => {
    const txs = [{ type: "income", amount: 5000000 }];
    const [a, b] = getPocketStats(pockets, txs);
    expect(a.allocated).toBe(1000000);
    expect(b.allocated).toBe(500000);
  });

  it("baseAllocated tetap alokasi awal setelah transfer", () => {
    const txs = [
      { type: "transfer", amount: 200000, fromPocketId: "a", toPocketId: "b" },
    ];
    const [a] = getPocketStats(pockets, txs);
    expect(a.baseAllocated).toBe(1000000);
  });
});
