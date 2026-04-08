import { Quote, Trash2, User } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { testimonialApi } from '@/api/testimonialApi'
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

// ─── Testimonial Card ─────────────────────────────────────
export function TestimonialCard({ testimonial, adminView = false }) {
  const { isAdmin, user } = useAuth()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () =>
      adminView
        ? testimonialApi.adminDeleteTestimonial(testimonial._id)
        : testimonialApi.deleteTestimonial(testimonial._id),
    onSuccess: () => {
      toast.success('Testimonial deleted')
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Delete failed')
    },
  })

  const isOwner = user?._id === testimonial.name?._id || user?._id === testimonial.name

  return (
    <div className="group relative rounded-xl border border-[#2A2A2A] bg-[#141414] p-5 transition-all duration-300 hover:border-yellow-500/20 hover:shadow-yellow">
      {/* Quote icon */}
      <Quote className="w-6 h-6 text-yellow-500/30 mb-3" />

      {/* Description */}
      <p className="text-sm text-[#999] leading-relaxed line-clamp-4">
        {testimonial.description}
      </p>

      {/* Author */}
      <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-[#252525] border border-[#2A2A2A] shrink-0">
            {testimonial.profilePhoto ? (
              <img
                src={testimonial.profilePhoto}
                alt={testimonial.username || 'Member'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#555]" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#F0F0F0]">
              {testimonial.username || 'Club Member'}
            </p>
            {adminView && (
              <Badge variant={testimonial.displayed ? 'green' : 'default'} className="mt-0.5">
                {testimonial.displayed ? 'Displayed' : 'Hidden'}
              </Badge>
            )}
          </div>
        </div>

        {/* Delete */}
        {(isAdmin || isOwner) && (
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="p-1.5 rounded-lg text-[#444] hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Member Card ──────────────────────────────────────────
const ROLE_LABELS = {
  coordinator: 'Coordinator',
  year3: '3rd Year',
  year2: '2nd Year',
  year1: '1st Year',
  default: 'Member',
}

export function MemberCard({ member }) {
  return (
    <div className="group rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden transition-all duration-300 hover:border-yellow-500/30 hover:shadow-yellow hover:-translate-y-0.5">
      {/* Profile photo */}
      <div className="h-48 bg-[#1C1C1C] overflow-hidden">
        {member.profilePhoto ? (
          <img
            src={member.profilePhoto}
            alt={member.name || 'Member'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <User className="w-8 h-8 text-yellow-500/40" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display font-semibold text-[#F0F0F0]">
              {member.name || 'Club Member'}
            </h3>
            <Badge variant="yellow" className="mt-1.5">
              {ROLE_LABELS[member.role] ?? 'Member'}
            </Badge>
          </div>
          <span className="text-xs text-[#555] shrink-0">
            {member.photos?.length ?? 0} photos
          </span>
        </div>
        {member.description && (
          <p className="mt-2.5 text-xs text-[#666] leading-relaxed line-clamp-3">
            {member.description}
          </p>
        )}
      </div>
    </div>
  )
}
