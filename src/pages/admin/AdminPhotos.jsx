import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { photoApi } from '@/api/photoApi'
import { ConfirmDialog, PageLoader, EmptyState } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Image, Trash2, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminPhotos() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['photos', { pagination: true, page, limit: 20 }],
    queryFn: () => photoApi.getAllPhotos({ pagination: 'true', page, limit: 20 }),
    select: (r) => r.data.data,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => photoApi.deletePhoto(id),
    onSuccess: () => {
      toast.success('Photo deleted')
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F0F0F0]">Photos</h1>
          <p className="text-sm text-[#555] mt-0.5">{data?.totalPhoto ?? 0} total photos</p>
        </div>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : data?.photos?.length ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.photos.map((photo) => (
              <div key={photo._id} className="group relative rounded-xl overflow-hidden border border-[#2A2A2A] aspect-square bg-[#141414]">
                <img
                  src={photo.imgUrl}
                  alt={photo.content || 'Photo'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end justify-between p-2">
                  <button
                    onClick={() => setDeleteTarget(photo)}
                    className="p-1.5 rounded-lg bg-black/60 text-red-400 hover:bg-red-500/40 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm">
                    <Heart className="w-3 h-3 text-red-400" />
                    <span className="text-xs text-white">{photo.likesCount ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <Button variant="surface" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-[#888]">
                Page <span className="text-[#F0F0F0] font-semibold">{page}</span> of {data.totalPages}
              </span>
              <Button variant="surface" size="sm" onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page === data.totalPages}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState icon={Image} title="No photos yet" description="Photos uploaded by members will appear here." />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        loading={deleteMutation.isPending}
        title="Delete Photo"
        description="Permanently delete this photo? This cannot be undone."
      />
    </div>
  )
}
