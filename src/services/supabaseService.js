import { supabase } from './supabaseClient'

export async function getRecords() {
  try {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch records:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Error fetching records:', err)
    return []
  }
}

export async function saveRecord(record) {
  try {
    const { data, error } = await supabase
      .from('records')
      .insert([record])
      .select()

    if (error) {
      console.error('Failed to save record:', error.message)
      throw new Error(error.message)
    }
    return data?.[0] || null
  } catch (err) {
    console.error('Error saving record:', err)
    throw err
  }
}

export async function deleteRecord(id) {
  try {
    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete record:', error.message)
      throw new Error(error.message)
    }
  } catch (err) {
    console.error('Error deleting record:', err)
    throw err
  }
}
