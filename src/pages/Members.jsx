import { useQuery } from '@tanstack/react-query'
import { memberApi } from '@/api/memberApi'
import { MemberCard } from '@/components/shared/TestimonialCard'
import { PageLoader, EmptyState } from '@/components/ui/badge'
import { UserCog } from 'lucide-react'

export default function Members() {
  const { data: members, isLoading } = useQuery({
    queryKey: ['admin-members'],
    queryFn: () => memberApi.getAllMembers(),
    select: (r) => r.data.data?.filter((m) => m.displayed) ?? [],
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <div className="accent-line mb-3" />
          <h1 className="section-title">Meet the Team</h1>
          <p className="section-subtitle">The creative minds behind Artive</p>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : members?.length ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {members.map((m) => (
              <MemberCard key={m._id} member={m} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={UserCog}
            title="No members to show"
            description="Team profiles will appear here once added by admins."
          />
        )}
      </div>
    </div>
  )
}
