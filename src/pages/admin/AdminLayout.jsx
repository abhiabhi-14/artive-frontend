import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Users, CalendarDays, Image, Quote,
  Camera, UserCog, LogOut, ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/admin',            label: 'Dashboard',     icon: LayoutDashboard, end: true },
  { to: '/admin/users',      label: 'Users',          icon: Users },
  { to: '/admin/events',     label: 'Events',         icon: CalendarDays },
  { to: '/admin/photos',     label: 'Photos',         icon: Image },
  { to: '/admin/members',    label: 'Members',        icon: UserCog },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  return (
    <div className="flex min-h-screen bg-[#080808]">

      {/* ── Sidebar ── */}
      <aside className="w-60 shrink-0 flex flex-col border-r border-[#1C1C1C] bg-[#0D0D0D]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-5 py-5 border-b border-[#1C1C1C]">
          <div className="w-7 h-7 rounded-lg bg-yellow-500 flex items-center justify-center">
            <Camera className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-display text-lg font-bold text-[#F0F0F0]">
            Artive<span className="text-yellow-500">.</span>
          </span>
          <span className="ml-auto text-[10px] font-semibold bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded-full">
            Admin
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    : 'text-[#666] hover:text-[#F0F0F0] hover:bg-[#1A1A1A]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-yellow-500' : '')} />
                  {label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto text-yellow-500/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-[#1C1C1C]">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] mb-1">
            <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-yellow-500 uppercase">{user?.username?.[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#F0F0F0] truncate">{user?.username}</p>
              <p className="text-[10px] text-[#555] truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-xs text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-x-hidden">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
