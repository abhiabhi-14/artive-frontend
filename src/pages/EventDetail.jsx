import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventApi } from '@/api/eventApi'
import { likeApi } from '@/api/likeApi'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/badge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CalendarDays, MapPin, Users, Heart, ArrowLeft, ShieldCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function EventDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventApi.getEvent(slug),
    select: (res) => res.data.data,
  })

  const likeMutation = useMutation({
    mutationFn: () =>
      event?.isLiked ? likeApi.unlikeEvent(event._id) : likeApi.likeEvent(event._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', slug] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Action failed')
    },
  })

  if (isLoading) return <PageLoader />

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-6xl font-display font-bold text-yellow-500">404</p>
          <p className="text-[#888] mt-2 mb-5">Event not found</p>
          <Button onClick={() => navigate('/events')} variant="outline">
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Button>
        </div>
      </div>
    )
  }

  const date = new Date(event.dateOfEvent)
  const isPast = date < new Date()

  return (
    <div className="min-h-screen bg-[#0A0A0A]">

      {/* ── Hero image ── */}
      {event.photos?.[0] && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img
            src={event.photos[0]}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Back ── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-[#666] hover:text-yellow-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>

        {/* ── Title row ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <Badge variant={isPast ? 'default' : 'yellow'} className="mb-3">
              {isPast ? 'Completed' : 'Upcoming'}
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#F0F0F0]">
              {event.name}
            </h1>
          </div>

          {/* Like */}
          {isAuthenticated && (
            <Button
              variant={event.isLiked ? 'danger' : 'surface'}
              onClick={() => likeMutation.mutate()}
              loading={likeMutation.isPending}
              className="shrink-0"
            >
              <Heart className={cn('w-4 h-4', event.isLiked && 'fill-current')} />
              {event.likesCount ?? 0} Likes
            </Button>
          )}
        </div>

        {/* ── Meta grid ── */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: CalendarDays, label: 'Date', value: date.toLocaleDateString('en-IN', { dateStyle: 'long' }) },
            { icon: MapPin,        label: 'Venue', value: event.venue },
            { icon: Users,         label: 'Team Size', value: `${event.teamSize} members` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-[#555] uppercase tracking-wider font-medium">{label}</span>
              </div>
              <p className="text-sm text-[#F0F0F0] font-medium">{value}</p>
            </div>
          ))}
        </div>

        {/* ── Description ── */}
        <div className="mb-8">
          <h2 className="font-display text-xl font-semibold text-[#F0F0F0] mb-3">About this Event</h2>
          <p className="text-[#888] leading-relaxed whitespace-pre-wrap">{event.description}</p>
        </div>

        {/* ── Rules ── */}
        {event.rules && (
          <div className="mb-8 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-yellow-500" />
              <h2 className="font-display text-lg font-semibold text-[#F0F0F0]">Rules & Guidelines</h2>
            </div>
            <p className="text-sm text-[#888] leading-relaxed whitespace-pre-wrap">{event.rules}</p>
          </div>
        )}

        {/* ── Photo gallery ── */}
        {event.photos?.length > 1 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-[#F0F0F0] mb-4">Event Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {event.photos.map((url, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-[#1C1C1C] border border-[#2A2A2A]">
                  <img
                    src={url}
                    alt={`Event photo ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-[1.05] transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
