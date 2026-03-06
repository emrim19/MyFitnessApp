import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export interface PersonalRecord {
  exerciseName: string
  muscleGroup: string | null
  weightKg: number
  reps: number | null
}

function getStartOfWeek(): string {
  const d = new Date()
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

export function usePersonalRecords() {
  const [records, setRecords] = useState<PersonalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const startOfWeek = getStartOfWeek()

      // Step 1: workout IDs for this week
      const { data: weekWorkouts } = await supabase
        .from('workouts')
        .select('id')
        .gte('date', startOfWeek)

      const weekWorkoutIds = (weekWorkouts ?? []).map(w => w.id)
      if (weekWorkoutIds.length === 0) {
        setRecords([])
        setLoading(false)
        return
      }

      // Step 2: this week's sets (with exercise name) + all-time sets in parallel
      const [weekSetsRes, allSetsRes] = await Promise.all([
        supabase
          .from('workout_sets')
          .select('exercise_id, weight_kg, reps, exercises(name, muscle_group)')
          .in('workout_id', weekWorkoutIds)
          .not('exercise_id', 'is', null)
          .not('weight_kg', 'is', null),
        supabase
          .from('workout_sets')
          .select('exercise_id, weight_kg')
          .not('exercise_id', 'is', null)
          .not('weight_kg', 'is', null),
      ])

      const weekSets = weekSetsRes.data ?? []
      const allSets = allSetsRes.data ?? []

      // All-time max weight per exercise
      const allTimeMax: Record<string, number> = {}
      for (const s of allSets) {
        if (!s.exercise_id || s.weight_kg == null) continue
        allTimeMax[s.exercise_id] = Math.max(allTimeMax[s.exercise_id] ?? 0, s.weight_kg)
      }

      // This week's best set per exercise (highest weight; track reps at that weight)
      const weekBest: Record<string, { weight: number; reps: number | null; name: string; muscleGroup: string | null }> = {}
      for (const s of weekSets) {
        if (!s.exercise_id || s.weight_kg == null) continue
        const exRaw = s.exercises as unknown
        const ex = Array.isArray(exRaw)
          ? (exRaw[0] as { name: string; muscle_group: string | null } | undefined) ?? null
          : (exRaw as { name: string; muscle_group: string | null } | null)
        const existing = weekBest[s.exercise_id]
        if (!existing || s.weight_kg > existing.weight) {
          weekBest[s.exercise_id] = {
            weight: s.weight_kg,
            reps: s.reps ?? null,
            name: ex?.name ?? 'Unknown',
            muscleGroup: ex?.muscle_group ?? null,
          }
        }
      }

      // A PR = this week's best equals the all-time max for that exercise
      const prs: PersonalRecord[] = []
      for (const [exerciseId, best] of Object.entries(weekBest)) {
        if (best.weight >= (allTimeMax[exerciseId] ?? 0)) {
          prs.push({
            exerciseName: best.name,
            muscleGroup: best.muscleGroup,
            weightKg: best.weight,
            reps: best.reps,
          })
        }
      }

      setRecords(prs)
      setLoading(false)
    }

    load()
  }, [])

  return { records, loading }
}
