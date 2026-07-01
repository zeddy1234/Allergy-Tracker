import { supabase } from './supabase'

function todayISO() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60000)
  return local.toISOString().slice(0, 10)
}

export { todayISO }

// ---------- Saved items (the "remember what I typed" chips) ----------

export async function fetchSavedItems(category) {
  const { data, error } = await supabase
    .from('saved_items')
    .select('*')
    .eq('category', category)
    .order('use_count', { ascending: false })
    .order('last_used_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function recordItemUse(category, label) {
  const trimmed = label.trim()
  if (!trimmed) return

  const { data: existing, error: fetchErr } = await supabase
    .from('saved_items')
    .select('*')
    .eq('category', category)
    .eq('label', trimmed)
    .maybeSingle()

  if (fetchErr) throw fetchErr

  if (existing) {
    const { error } = await supabase
      .from('saved_items')
      .update({
        use_count: existing.use_count + 1,
        last_used_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('saved_items')
      .insert({ category, label: trimmed })
    if (error) throw error
  }
}

export async function deleteSavedItem(id) {
  const { error } = await supabase.from('saved_items').delete().eq('id', id)
  if (error) throw error
}

// ---------- Daily entries ----------

export async function fetchEntry(dateStr) {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .eq('entry_date', dateStr)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function fetchAllEntries() {
  const { data, error } = await supabase
    .from('daily_entries')
    .select('*')
    .order('entry_date', { ascending: true })

  if (error) throw error
  return data || []
}

export async function upsertEntry(entry) {
  const { error } = await supabase
    .from('daily_entries')
    .upsert(entry, { onConflict: 'entry_date' })

  if (error) throw error
}
