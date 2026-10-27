// allocated (hasil) = alokasi awal + transfer masuk - transfer keluar
// spent = total pengeluaran dari pocket itu
export function getPocketStats(pockets, transactions) {
  return pockets.map((p) => {
    let budget = p.allocated;
    let spent = 0;

    for (const t of transactions) {
      if (t.type === "expense" && t.pocketId === p.id) spent += t.amount;
      if (t.type === "transfer") {
        if (t.fromPocketId === p.id) budget -= t.amount;
        if (t.toPocketId === p.id) budget += t.amount;
      }
    }

    return { ...p, baseAllocated: p.allocated, allocated: budget, spent };
  });
}
