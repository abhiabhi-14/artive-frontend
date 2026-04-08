import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'
import { photoApi } from '@/api/photoApi'
import { eventApi } from '@/api/eventApi'
import { testimonialApi } from '@/api/testimonialApi'
import { memberApi } from '@/api/memberApi'
import { useAuth } from '@/hooks/useAuth'
import { Spinner } from '@/components/ui/badge'
import {
  Users, Image, CalendarDays, Quote, UserCog,
  TrendingUp, ArrowRight, Activity,
} from 'lucide-react'
import { Link } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, sub, to, color = 'yellow' }) {
  const colors = {
    yellow: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500',
    blue:   'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green:  'bg-green-500/10 border-green-500/20 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    red:    'bg-red-500/10 border-red-500/20 text-red-400',
  }
  return (
    <Link
      to={to}
      className="group rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 hover:border-yellow-500/20 transition-all duration-200 hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <ArrowRight className="w-4 h-4 text-[#333] group-hover:text-yellow-500 transition-colors" />
      </div>
      <div className="mt-4">
        {value === undefined ? (
          <div className="h-7 w-16 rounded-md bg-[#252525] animate-pulse" />
        ) : (
          <p className="font-display text-2xl font-bold text-[#F0F0F0]">{value}</p>
        )}
        <p className="text-sm text-[#666] mt-0.5">{label}</p>
        {sub && <p className="text-xs text-[#444] mt-1">{sub}</p>}
      </div>
    </Link>
  )
}

function RecentItem({ label, sub, dot = 'yellow' }) {
  const dots = {
    yellow: 'bg-yellow-500',
    green:  'bg-green-500',
    blue:   'bg-blue-500',
  }
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#1C1C1C] last:border-0">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dots[dot] ?? dots.yellow}`} />
      <div className="min-w-0">
        <p className="text-sm text-[#F0F0F0] truncate">{label}</p>
        {sub && <p className="text-xs text-[#555]">{sub}</p>}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { user } = useAuth()

  const { data: users }        = useQuery({ queryKey: ['admin-users'],        queryFn: () => authApi.getAllUsers(),           select: r => r.data.data })
  const { data: photos }       = useQuery({ queryKey: ['photos'],             queryFn: () => photoApi.getAllPhotos(),          select: r => r.data.data })
  const { data: events }       = useQuery({ queryKey: ['events'],             queryFn: () => eventApi.getAllEvents(),          select: r => r.data.data })
  const { data: testimonials } = useQuery({ queryKey: ['testimonials'],       queryFn: () => testimonialApi.getAllTestimonials(), select: r => r.data.data })
  const { data: members }      = useQuery({ queryKey: ['admin-members'],      queryFn: () => memberApi.getAllMembers(),        select: r => r.data.data })

  const stats = [
    { icon: Users,       label: 'Total Users',        value: users?.length,        to: '/admin/users',       color: 'blue' },
    { icon: UserCog,     label: 'Members',             value: members?.length,       to: '/admin/members',     color: 'purple' },
    { icon: Image,       label: 'Photos Uploaded',     value: photos?.totalPhoto,    to: '/admin/photos',      color: 'yellow' },
    { icon: CalendarDays,label: 'Events Created',      value: events?.totalEvents,   to: '/admin/events',      color: 'green' },
    { icon: Quote,       label: 'Testimonials',        value: testimonials?.length,  to: '/admin/testimonials',color: 'red' },
  ]

  const recentUsers   = users?.slice(0, 5)   ?? []
  const recentEvents  = events?.events?.slice(0, 5) ?? []

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-yellow-500" />
          <span className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">Admin Panel</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-[#F0F0F0]">
          Good to see you, {user?.username}
        </h1>
        <p className="text-sm text-[#555] mt-1">Here's what's happening across Artive.</p>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Lower panels ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Recent Users */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
            <h2 className="font-display text-base font-semibold text-[#F0F0F0]">Recent Users</h2>
            <Link to="/admin/users" className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="px-5 py-2">
            {recentUsers.length ? recentUsers.map((u) => (
              <RecentItem
                key={u._id}
                label={u.username}
                sub={`${u.email} · ${u.role}`}
                dot={u.role === 'admin' ? 'yellow' : 'blue'}
              />
            )) : (
              <p className="py-6 text-center text-sm text-[#444]">No users yet</p>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
            <h2 className="font-display text-base font-semibold text-[#F0F0F0]">Recent Events</h2>
            <Link to="/admin/events" className="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="px-5 py-2">
            {recentEvents.length ? recentEvents.map((e) => (
              <RecentItem
                key={e._id}
                label={e.name}
                sub={`${e.venue} · ${new Date(e.dateOfEvent).toLocaleDateString('en-IN')}`}
                dot="green"
              />
            )) : (
              <p className="py-6 text-center text-sm text-[#444]">No events yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
