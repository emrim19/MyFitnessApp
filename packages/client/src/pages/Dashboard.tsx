import { Link } from 'react-router-dom'
import { useWorkouts } from '../hooks/useWorkouts'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export default function Dashboard() {
  const { workouts, loading, error } = useWorkouts(10)

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/log"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          + Start workout
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Recent workouts
        </h2>

        {loading && (
          <p className="text-sm text-gray-400">Loading…</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && workouts.length === 0 && (
          <p className="rounded-xl border border-dashed border-gray-300 py-12 text-center text-sm text-gray-400">
            No workouts yet — hit <strong>Start workout</strong> to log your first session.
          </p>
        )}

        {!loading && !error && workouts.length > 0 && (
          <ul className="space-y-2">
            {workouts.map(w => (
              <li key={w.id}>
                <Link
                  to={`/workout/${w.id}`}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{w.title ?? 'Workout'}</p>
                    <p className="text-sm text-gray-500">{formatDate(w.date)}</p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {w.duration_minutes ? `${w.duration_minutes} min` : '›'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
