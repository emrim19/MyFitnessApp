import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface Exercise {
  id: string
  name: string
  muscle_group: string | null
  type: 'strength' | 'cardio' | 'bodyweight'
}

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    const { data } = await supabase
      .from('exercises')
      .select('id, name, muscle_group, type')
      .order('name')
    setExercises(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { exercises, loading, refetch: fetch }
}
