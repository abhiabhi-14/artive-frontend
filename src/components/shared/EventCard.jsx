import { Link } from 'react-router-dom'
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function EventCard({ event, className }) {
  const date = new Date(event.dateOfEvent)
  const isPast = date < new Date()

  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Link
      to={`/events/${event.slug}`}
      className={cn(
        'group block rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden',
        'transition-all duration-300 hover:border-yellow-500/30 hover:shadow-yellow hover:-translate-y-0.5',
        className,
      )}
    >
      {/* Event banner image */}
      {event.photos?.[0] ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.photos[0]}
            alt={event.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <Badge variant={isPast ? 'default' : 'yellow'}>
              {isPast ? 'Completed' : 'Upcoming'}
            </Badge>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-yellow-500/10 to-transparent flex items-center justify-center border-b border-[#2A2A2A]">
          <CalendarDays className="w-10 h-10 text-yellow-500/30" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-[#F0F0F0] line-clamp-1 group-hover:text-yellow-500 transition-colors">
          {event.name}
        </h3>
        <p className="mt-1.5 text-sm text-[#666] line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        {/* Meta */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#666]">
            <CalendarDays className="w-3.5 h-3.5 text-yellow-500/60 shrink-0" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#666]">
            <MapPin className="w-3.5 h-3.5 text-yellow-500/60 shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#666]">
            <Users className="w-3.5 h-3.5 text-yellow-500/60 shrink-0" />
            Team size: {event.teamSize}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
          <span className="text-xs text-[#555]">{event.likesCount ?? 0} likes</span>
          <span className="flex items-center gap-1 text-xs font-semibold text-yellow-500 group-hover:gap-2 transition-all">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
