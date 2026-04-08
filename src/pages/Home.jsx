import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { photoApi } from '@/api/photoApi'
import { eventApi } from '@/api/eventApi'
import { testimonialApi } from '@/api/testimonialApi'
import EventCard from '@/components/shared/EventCard'
import { TestimonialCard } from '@/components/shared/TestimonialCard'
import { Spinner } from '@/components/ui/badge'
import {
  ArrowRight, Camera, Palette, Users, Star, Sparkles, Image,
} from 'lucide-react'

const STATS = [
  { icon: Image,    value: '500+',  label: 'Photos Shared' },
  { icon: Camera,   value: '30+',   label: 'Events Hosted' },
  { icon: Users,    value: '120+',  label: 'Club Members' },
  { icon: Star,     value: '4.9★',  label: 'Member Rating' },
]

const FEATURES = [
  {
    icon: Camera,
    title: 'Shoot & Share',
    description: 'Upload your best captures. Build your creative portfolio with the club.',
  },
  {
    icon: Palette,
    title: 'Create Together',
    description: 'Participate in themed events, workshops, and collaborative projects.',
  },
  {
    icon: Users,
    title: 'Grow as a Community',
    description: 'Connect with fellow artists, get feedback, and elevate each other.',
  },
]

export default function Home() {
  const { data: photosData } = useQuery({
    queryKey: ['photos', { pagination: true, limit: 8 }],
    queryFn: () => photoApi.getAllPhotos({ pagination: true, limit: 8 }),
    select: (res) => res.data.data,
  })

  const { data: eventsData } = useQuery({
    queryKey: ['events', { pagination: true, limit: 3 }],
    queryFn: () => eventApi.getAllEvents({ pagination: true, limit: 3 }),
    select: (res) => res.data.data,
  })

  const { data: testimonialData } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialApi.getAllTestimonials(),
    select: (res) => res.data.data?.slice(0, 3) ?? [],
  })

  return (
    <div className="overflow-hidden">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center hero-mesh bg-grid-pattern">
        {/* Decorative blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-500/4 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/25 bg-yellow-500/8 mb-7 animate-fade-up">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs font-semibold text-yellow-400 tracking-wide uppercase">
                Est. 2018 · Campus Creative Club
              </span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[#F0F0F0] leading-[1.07] tracking-tight animate-fade-up delay-100">
              Where College{' '}
              <span className="text-yellow-500 text-glow italic">Art</span>
              <br />
              Comes Alive
            </h1>

            {/* Sub */}
            <p className="mt-6 text-lg text-[#666] leading-relaxed max-w-xl animate-fade-up delay-200">
              Artive is a creative sanctuary for photographers, painters, and visual storytellers.
              Join us — shoot, share, and inspire.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-up delay-300">
              <Link to="/register" className="btn-primary text-base px-7 py-3 shadow-yellow-lg">
                Join the Club
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/gallery" className="btn-outline text-base px-7 py-3">
                Explore Gallery
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-3 animate-fade-up delay-400">
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D'].map((l) => (
                  <div
                    key={l}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500/30 to-yellow-700/30 border-2 border-[#0A0A0A] flex items-center justify-center text-xs font-bold text-yellow-400"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#666]">
                <span className="text-[#F0F0F0] font-semibold">120+ members</span> already creating
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-yellow-500/50 to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════ */}
      <section className="border-y border-[#1C1C1C] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-[#1C1C1C]">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center text-center py-2 px-4">
                <Icon className="w-5 h-5 text-yellow-500 mb-2" />
                <span className="font-display text-2xl font-bold text-[#F0F0F0]">{value}</span>
                <span className="text-xs text-[#555] mt-0.5">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED PHOTOS
      ══════════════════════════════════════ */}
      <section className="py-20 gallery-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="accent-line mb-3" />
              <h2 className="section-title">Recent Captures</h2>
              <p className="section-subtitle">Stunning moments from our community</p>
            </div>
            <Link
              to="/gallery"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-yellow-500 hover:gap-2.5 transition-all"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {photosData?.photos?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photosData.photos.slice(0, 8).map((photo) => (
                <div
                  key={photo._id}
                  className="group relative rounded-xl overflow-hidden aspect-square bg-[#141414] border border-[#2A2A2A]"
                >
                  <img
                    src={photo.imgUrl}
                    alt={photo.content || 'Photo'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl bg-[#1C1C1C] animate-pulse" />
              ))}
            </div>
          )}

          <div className="mt-6 flex sm:hidden justify-center">
            <Link to="/gallery" className="btn-outline">
              View all photos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section className="py-20 border-y border-[#1C1C1C] bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex justify-center mb-3">
              <div className="accent-line" />
            </div>
            <h2 className="section-title">Why Join Artive?</h2>
            <p className="section-subtitle mx-auto max-w-md">
              More than a club — it's a movement that nurtures creative voices on campus.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-xl border border-[#2A2A2A] bg-[#141414] p-6 transition-all duration-300 hover:border-yellow-500/30 hover:-translate-y-1"
              >
                <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-yellow-500" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#F0F0F0] mb-2">{title}</h3>
                <p className="text-sm text-[#666] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          UPCOMING EVENTS
      ══════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="accent-line mb-3" />
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Don't miss what's happening in the club</p>
            </div>
            <Link
              to="/events"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-yellow-500 hover:gap-2.5 transition-all"
            >
              All events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {eventsData?.events?.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {eventsData.events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-[#2A2A2A] bg-[#141414] h-64 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      {testimonialData?.length > 0 && (
        <section className="py-20 border-t border-[#1C1C1C] bg-[#0D0D0D]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="flex justify-center mb-3">
                <div className="accent-line" />
              </div>
              <h2 className="section-title">What Members Say</h2>
              <p className="section-subtitle mx-auto max-w-md">
                Hear from the artists who call Artive home.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonialData.map((t) => (
                <TestimonialCard key={t._id} testimonial={t} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link to="/testimonials" className="btn-outline">
                Read all stories <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent overflow-hidden p-10 md:p-14 text-center">
            {/* Decorative */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="relative">
              <Sparkles className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#F0F0F0] mb-3">
                Ready to Create Something <br />
                <span className="text-yellow-500 italic">Extraordinary?</span>
              </h2>
              <p className="text-[#666] mb-8 max-w-md mx-auto">
                Join Artive and be part of a vibrant community of creatives shaping
                the visual culture of campus.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="btn-primary text-base px-8 py-3">
                  Get Started Free
                </Link>
                <Link to="/gallery" className="btn-outline text-base px-8 py-3">
                  Explore Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
