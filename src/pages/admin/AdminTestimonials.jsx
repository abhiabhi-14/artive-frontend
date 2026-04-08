import { useQuery } from '@tanstack/react-query'
import { testimonialApi } from '@/api/testimonialApi'
import { TestimonialCard } from '@/components/shared/TestimonialCard'
import { PageLoader, EmptyState } from '@/components/ui/badge'
import { Quote } from 'lucide-react'

export default function AdminTestimonials() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialApi.getAllTestimonials(),
    select: (r) => r.data.data ?? [],
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-[#F0F0F0]">Testimonials</h1>
        <p className="text-sm text-[#555] mt-0.5">{testimonials?.length ?? 0} member stories</p>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : testimonials?.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard key={t._id} testimonial={t} adminView />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Quote}
          title="No testimonials yet"
          description="Member testimonials will appear here once submitted."
        />
      )}
    </div>
  )
}
