export type ExerciseType = 'strength' | 'cardio' | 'bodyweight'

export interface SetRow {
  reps: string
  weight_kg: string
  duration_minutes: string
  distance_km: string
  rpe: string
}

export function emptySet(): SetRow {
  return { reps: '', weight_kg: '', duration_minutes: '', distance_km: '', rpe: '' }
}

export const inputCls =
  'rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'

export function setTypeLabel(type: ExerciseType) {
  if (type === 'cardio') return 'min · km'
  if (type === 'bodyweight') return 'reps · RPE'
  return 'reps · kg'
}

export function SetInputs({
  type,
  set,
  onChange,
}: {
  type: ExerciseType
  set: SetRow
  onChange: (field: keyof SetRow, value: string) => void
}) {
  if (type === 'strength') {
    return (
      <>
        <input type="number" placeholder="Reps" value={set.reps}
          onChange={e => onChange('reps', e.target.value)} className={`w-24 ${inputCls}`} />
        <input type="number" placeholder="kg" value={set.weight_kg}
          onChange={e => onChange('weight_kg', e.target.value)} className={`w-24 ${inputCls}`} />
      </>
    )
  }
  if (type === 'cardio') {
    return (
      <>
        <input type="number" placeholder="Min" value={set.duration_minutes}
          onChange={e => onChange('duration_minutes', e.target.value)} className={`w-24 ${inputCls}`} />
        <input type="number" placeholder="km" value={set.distance_km}
          onChange={e => onChange('distance_km', e.target.value)} className={`w-24 ${inputCls}`} />
      </>
    )
  }
  return (
    <>
      <input type="number" placeholder="Reps" value={set.reps}
        onChange={e => onChange('reps', e.target.value)} className={`w-24 ${inputCls}`} />
      <input type="number" placeholder="RPE 1–10" min={1} max={10} value={set.rpe}
        onChange={e => onChange('rpe', e.target.value)} className={`w-24 ${inputCls}`} />
    </>
  )
}
