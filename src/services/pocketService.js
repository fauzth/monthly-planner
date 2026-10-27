import { supabase } from "../lib/supabaseClient";

// snake_case (database) <-> camelCase (app)
const fromRow = (r) => ({
  id: r.id,
  name: r.name,
  allocated: r.allocated,
  color: r.color,
  archived: r.archived,
});

const toRow = (p) => {
  const row = {};
  if (p.name !== undefined) row.name = p.name;
  if (p.allocated !== undefined) row.allocated = p.allocated;
  if (p.color !== undefined) row.color = p.color;
  if (p.archived !== undefined) row.archived = p.archived;
  return row;
};

export async function fetchPockets() {
  const { data, error } = await supabase
    .from("pockets")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

export async function createPocket(pocket) {
  const { data, error } = await supabase
    .from("pockets")
    .insert(toRow(pocket))
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function updatePocketById(id, changes) {
  const { data, error } = await supabase
    .from("pockets")
    .update(toRow(changes))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deletePocketById(id) {
  const { error } = await supabase.from("pockets").delete().eq("id", id);
  if (error) throw error;
}
