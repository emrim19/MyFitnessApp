import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinkCls = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'}`

export default function Navbar() {
  const { signOut } = useAuth()

  return (
    <nav className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <NavLink to="/" end className="text-lg font-bold text-gray-900">
            MyFitnessApp
          </NavLink>
          <NavLink to="/" end className={navLinkCls}>Dashboard</NavLink>
          <NavLink to="/history" className={navLinkCls}>History</NavLink>
          <NavLink to="/progress" className={navLinkCls}>Progress</NavLink>
        </div>
        <button
          onClick={signOut}
          className="text-sm text-gray-400 hover:text-gray-900"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
