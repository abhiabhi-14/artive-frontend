import { useState } from 'react'
import { Heart, Trash2, Expand } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { likeApi } from '@/api/likeApi'
import { photoApi } from '@/api/photoApi'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function PhotoCard({ photo, onExpand }) {
  const { isAuthenticated, isAdmin, user } = useAuth()
  const queryClient = useQueryClient()
  const [imgLoaded, setImgLoaded] = useState(false)

  const likeMutation = useMutation({
    mutationFn: () =>
      photo.isLiked ? likeApi.unlikePhoto(photo._id) : likeApi.likePhoto(photo._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Action failed')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => photoApi.deletePhoto(photo._id),
    onSuccess: () => {
      toast.success('Photo deleted')
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Delete failed')
    },
  })

  // Check if current user owns the photo (via member check) or is admin
  const canDelete = isAdmin

  return (
    <div className="masonry-item group relative rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#141414]">
      {/* Image */}
      <div className="relative overflow-hidden">
        {!imgLoaded && (
          <div className="w-full aspect-square bg-[#1C1C1C] animate-pulse rounded-xl" />
        )}
        <img
          src={photo.imgUrl}
          alt={photo.content || 'Artive photo'}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={cn(
            'w-full object-cover transition-all duration-500 group-hover:scale-[1.03]',
            !imgLoaded && 'opacity-0 absolute inset-0',
          )}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Actions overlay */}
        <div className="absolute inset-0 flex items-end justify-between p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2">
            {/* Like */}
            {isAuthenticated && (
              <button
                onClick={() => likeMutation.mutate()}
                disabled={likeMutation.isPending}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all',
                  photo.isLiked
                    ? 'bg-red-500/90 text-white'
                    : 'bg-black/60 text-white hover:bg-red-500/80',
                )}
              >
                <Heart className={cn('w-3.5 h-3.5', photo.isLiked && 'fill-current')} />
                {photo.likesCount ?? 0}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {/* Expand */}
            {onExpand && (
              <button
                onClick={() => onExpand(photo)}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white hover:bg-white/20 transition-all"
              >
                <Expand className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Delete */}
            {canDelete && (
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-red-400 hover:bg-red-500/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Caption */}
      {photo.content && (
        <div className="px-3 py-2.5">
          <p className="text-xs text-[#888] leading-relaxed line-clamp-2">{photo.content}</p>
        </div>
      )}
    </div>
  )
}
