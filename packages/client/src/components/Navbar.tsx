import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const desktopLinkCls = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`

const bottomLinkCls = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
    isActive ? 'text-blue-600' : 'text-gray-400'
  }`

export default function Navbar() {
  const { signOut } = useAuth()

  return (
    <>
      {/* Top bar */}
      <nav className="border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-lg font-bold text-gray-900">MyFitnessApp</span>
            {/* Desktop-only nav links */}
            <div className="hidden items-center gap-6 sm:flex">
              <NavLink to="/" end className={desktopLinkCls}>Dashboard</NavLink>
              <NavLink to="/history" className={desktopLinkCls}>History</NavLink>
              <NavLink to="/progress" className={desktopLinkCls}>Progress</NavLink>
            </div>
          </div>
          <button
            onClick={signOut}
            className="text-sm text-gray-400 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white sm:hidden">
        <div className="flex">
          <NavLink to="/" end className={bottomLinkCls}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V20a.5.5 0 00.5.5h5v-5h5v5h5a.5.5 0 00.5-.5v-9.5" />
            </svg>
            Dashboard
          </NavLink>
          <NavLink to="/history" className={bottomLinkCls}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            History
          </NavLink>
          <NavLink to="/progress" className={bottomLinkCls}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 17l4-8 4 4 4-6 4 3" />
            </svg>
            Progress
          </NavLink>
        </div>
      </nav>
    </>
  )
}
