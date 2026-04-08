import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { eventApi } from '@/api/eventApi'
import EventCard from '@/components/shared/EventCard'
import { PageLoader, EmptyState } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalendarDays, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export default function Events() {
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const searchString = useDebounce(searchInput, 400)

  const isSearching = searchString.trim().length > 0

  // All events (paginated)
  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ['events', { pagination: true, page, limit: 9 }],
    queryFn: () => eventApi.getAllEvents({ pagination: 'true', page, limit: 9 }),
    select: (res) => res.data.data,
    enabled: !isSearching,
  })

  // Search results
  const { data: searchData, isLoading: searchLoading } = useQuery({
    queryKey: ['events-search', { searchString, page }],
    queryFn: () => eventApi.searchEvents({ searchString, page, limit: 9 }),
    select: (res) => res.data.data,
    enabled: isSearching,
  })

  const data = isSearching ? searchData : allData
  const isLoading = isSearching ? searchLoading : allLoading

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="accent-line mb-3" />
          <h1 className="section-title">Events</h1>
          <p className="section-subtitle">Photography walks, exhibitions, and creative workshops</p>
        </div>

        {/* ── Search ── */}
        <div className="mb-8 max-w-sm">
          <Input
            leftIcon={Search}
            placeholder="Search events…"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1) }}
          />
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <PageLoader />
        ) : data?.events?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarDays}
            title={isSearching ? 'No events found' : 'No events yet'}
            description={
              isSearching
                ? `No events matched "${searchString}"`
                : 'Check back soon for upcoming events!'
            }
          />
        )}

        {/* ── Pagination ── */}
        {data?.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <Button
              variant="surface"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  p === page
                    ? 'bg-yellow-500 text-black'
                    : 'text-[#888] hover:text-[#F0F0F0] hover:bg-[#1C1C1C]'
                }`}
              >
                {p}
              </button>
            ))}
            <Button
              variant="surface"
              size="sm"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page === data.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
