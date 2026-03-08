import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export type MuscleVolumePeriod = 'week' | '4weeks'

export interface MuscleGroupVolume {
  group: string
  volume: number
}

function periodStart(period: MuscleVolumePeriod): string {
  const d = new Date()
  if (period === 'week') {
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day
    d.setDate(d.getDate() + diff)
  } else {
    d.setDate(d.getDate() - 27)
  }
  return d.toISOString().slice(0, 10)
}

export function useMuscleGroupVolume(period: MuscleVolumePeriod) {
  const [data, setData] = useState<MuscleGroupVolume[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)

      const start = periodStart(period)

      const { data: workouts } = await supabase
        .from('workouts')
        .select('id')
        .gte('date', start)
        .eq('is_rest_day', false)

      const ids = (workouts ?? []).map(w => w.id)
      if (ids.length === 0) { setData([]); setLoading(false); return }

      const { data: sets } = await supabase
        .from('workout_sets')
        .select('reps, weight_kg, exercises(muscle_group, type)')
        .in('workout_id', ids)

      const volumeMap = new Map<string, number>()
      for (const s of sets ?? []) {
        if (s.reps == null || s.weight_kg == null) continue
        const ex = (Array.isArray(s.exercises) ? s.exercises[0] : s.exercises) as { muscle_group: string | null; type: string } | null
        if (!ex) continue
        const group = ex.muscle_group ?? ex.type
        volumeMap.set(group, (volumeMap.get(group) ?? 0) + s.reps * s.weight_kg)
      }

      const result = [...volumeMap.entries()]
        .map(([group, volume]) => ({ group, volume }))
        .sort((a, b) => b.volume - a.volume)

      setData(result)
      setLoading(false)
    }

    load()
  }, [period])

  return { data, loading }
}
