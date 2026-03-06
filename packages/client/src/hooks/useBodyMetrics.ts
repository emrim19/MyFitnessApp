import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface BodyMetric {
  id: string
  date: string
  weight_kg: number | null
  height_cm: number | null
  body_fat_pct: number | null
  muscle_mass_kg: number | null
  notes: string | null
}

export interface NewBodyMetric {
  date: string
  weight_kg: number | null
  height_cm: number | null
  body_fat_pct: number | null
  muscle_mass_kg: number | null
  notes: string | null
}

export function useBodyMetrics() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('body_metrics')
      .select('id, date, weight_kg, height_cm, body_fat_pct, muscle_mass_kg, notes')
      .order('date', { ascending: true })

    if (error) setError(error.message)
    else setMetrics(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMetrics()
  }, [fetchMetrics])

  async function saveMetric(entry: NewBodyMetric) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('body_metrics')
      .insert({ ...entry, user_id: user.id })

    if (error) throw error
    await fetchMetrics()
  }

  return { metrics, loading, error, saveMetric }
}
