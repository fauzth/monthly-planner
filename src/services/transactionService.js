import { supabase } from "../lib/supabaseClient";

const fromRow = (r) => ({
  id: r.id,
  type: r.type,
  amount: r.amount,
  pocketId: r.pocket_id,
  fromPocketId: r.from_pocket_id,
  toPocketId: r.to_pocket_id,
  note: r.note,
  date: r.date,
});

// selalu kirim ketiga kolom pocket (null kalau tidak dipakai),
// supaya constraint tx_shape di database selalu terpenuhi, termasuk saat edit
const toRow = (t) => ({
  type: t.type,
  amount: t.amount,
  pocket_id: t.pocketId ?? null,
  from_pocket_id: t.fromPocketId ?? null,
  to_pocket_id: t.toPocketId ?? null,
  note: t.note ?? "",
  date: t.date,
});

export async function fetchTransactions() {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

export async function createTransaction(tx) {
  const { data, error } = await supabase
    .from("transactions")
    .insert(toRow(tx))
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateTransactionById(id, tx) {
  const { data, error } = await supabase
    .from("transactions")
    .update(toRow(tx))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteTransactionById(id) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}
