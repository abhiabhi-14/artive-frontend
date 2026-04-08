import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  Menu, X, Camera, LogOut, LayoutDashboard, User, ChevronDown,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/gallery',      label: 'Gallery' },
  { to: '/events',       label: 'Events' },
  { to: '/testimonials', label: 'Testimonials' },
]

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [scrolled,    setScrolled]    = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  // Scroll shadow
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('#user-menu')) setUserDropdown(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await logout()
    setUserDropdown(false)
    setMenuOpen(false)
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1E1E1E] shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ──────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            onClick={() => setMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center shadow-yellow group-hover:shadow-yellow-lg transition-shadow">
              <Camera className="w-4 h-4 text-black" />
            </div>
            <span className="font-display text-xl font-bold text-[#F0F0F0] tracking-tight">
              Artive
              <span className="text-yellow-500">.</span>
            </span>
          </Link>

          {/* ── Desktop Links ──────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'nav-link px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-yellow-500'
                      : 'text-[#888] hover:text-[#F0F0F0]',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* ── Desktop Auth ───────────────── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" id="user-menu">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#F0F0F0] hover:bg-[#1C1C1C] transition-colors border border-[#2A2A2A]"
                >
                  <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                    <span className="text-xs font-semibold text-yellow-500 uppercase">
                      {user?.username?.[0]}
                    </span>
                  </div>
                  <span className="font-medium max-w-[100px] truncate">{user?.username}</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 text-[#555] transition-transform', userDropdown && 'rotate-180')} />
                </button>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[#2A2A2A] bg-[#141414] shadow-2xl overflow-hidden animate-fade-up">
                    <div className="px-4 py-3 border-b border-[#2A2A2A]">
                      <p className="text-xs text-[#555] font-medium uppercase tracking-wider">Signed in as</p>
                      <p className="text-sm font-semibold text-[#F0F0F0] truncate mt-0.5">{user?.email}</p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#888] hover:text-[#F0F0F0] hover:bg-[#1C1C1C] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-[#888] hover:text-[#F0F0F0] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors shadow-yellow"
                >
                  Join Club
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Menu Toggle ──────────── */}
          <button
            className="md:hidden p-2 rounded-lg text-[#888] hover:text-[#F0F0F0] hover:bg-[#1C1C1C] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ─────────────────────── */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#1E1E1E] bg-[#0A0A0A]/98 backdrop-blur-md animate-slide-in">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-yellow-500/10 text-yellow-500'
                      : 'text-[#888] hover:text-[#F0F0F0] hover:bg-[#1C1C1C]',
                  )
                }
              >
                {label}
              </NavLink>
            ))}

            <div className="pt-3 mt-3 border-t border-[#1E1E1E] space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                      <span className="text-xs font-semibold text-yellow-500 uppercase">
                        {user?.username?.[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#F0F0F0]">{user?.username}</p>
                      <p className="text-xs text-[#555]">{user?.role}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm text-[#888] hover:text-[#F0F0F0] hover:bg-[#1C1C1C] transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium border border-[#2A2A2A] text-[#888] hover:text-[#F0F0F0] hover:bg-[#1C1C1C] transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-yellow-500 text-black hover:bg-yellow-400 transition-colors"
                  >
                    Join Club
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
