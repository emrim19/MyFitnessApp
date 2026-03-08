import { useState } from 'react'

const STORAGE_KEY = 'muscle-group-colors'

export const DEFAULT_MUSCLE_COLORS: Record<string, string> = {
  chest:     '#ef4444',
  back:      '#3b82f6',
  shoulders: '#f59e0b',
  biceps:    '#8b5cf6',
  triceps:   '#ec4899',
  legs:      '#22c55e',
  core:      '#f97316',
  cardio:    '#14b8a6',
}

export function useMuscleGroupColors() {
  const [colors, setColors] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? { ...DEFAULT_MUSCLE_COLORS, ...JSON.parse(stored) } : { ...DEFAULT_MUSCLE_COLORS }
    } catch {
      return { ...DEFAULT_MUSCLE_COLORS }
    }
  })

  function setColor(group: string, color: string) {
    setColors(prev => {
      const next = { ...prev, [group]: color }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  function getColor(group: string): string {
    return colors[group] ?? '#64748b'
  }

  return { setColor, getColor }
}
