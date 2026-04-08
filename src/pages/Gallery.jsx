import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { photoApi } from '@/api/photoApi'
import PhotoCard from '@/components/shared/PhotoCard'
import { PageLoader, EmptyState, Dialog } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { Image, Upload, ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Gallery() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  // ── Fetch photos ─────────────────────────────────────────
  const { data, isLoading } = useQuery({
    queryKey: ['photos', { pagination: true, page, limit: 12 }],
    queryFn: () => photoApi.getAllPhotos({ pagination: 'true', page, limit: 12 }),
    select: (res) => res.data.data,
  })

  // ── Upload form state ─────────────────────────────────────
  const [form, setForm] = useState({ content: '' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  const uploadMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('content', form.content)
      return photoApi.createPhoto(fd)
    },
    onSuccess: () => {
      toast.success('Photo uploaded successfully!')
      setUploadOpen(false)
      setFile(null)
      setPreview(null)
      setForm({ content: '' })
      queryClient.invalidateQueries({ queryKey: ['photos'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Upload failed')
    },
  })

  const handleFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  return (
    <div className="min-h-screen gallery-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="accent-line mb-3" />
            <h1 className="section-title">Gallery</h1>
            <p className="section-subtitle">
              {data?.totalPhoto ?? '–'} photos from our community
            </p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setUploadOpen(true)}>
              <Upload className="w-4 h-4" /> Upload Photo
            </Button>
          )}
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <PageLoader />
        ) : data?.photos?.length > 0 ? (
          <div className="masonry-grid">
            {data.photos.map((photo) => (
              <PhotoCard
                key={photo._id}
                photo={photo}
                onExpand={(p) => setLightbox(p)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Image}
            title="No photos yet"
            description="Be the first to share your creative work with the club."
            action={
              isAuthenticated && (
                <Button onClick={() => setUploadOpen(true)}>
                  <Upload className="w-4 h-4" /> Upload Photo
                </Button>
              )
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
            <span className="text-sm text-[#888]">
              Page <span className="text-[#F0F0F0] font-semibold">{page}</span> of {data.totalPages}
            </span>
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

      {/* ── Upload Dialog ── */}
      <Dialog
        open={uploadOpen}
        onClose={() => { setUploadOpen(false); setPreview(null); setFile(null) }}
        title="Upload a Photo"
        description="Share your best capture with the Artive community."
      >
        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onClick={() => fileRef.current?.click()}
            className="relative rounded-xl border-2 border-dashed border-[#2A2A2A] hover:border-yellow-500/40 transition-colors cursor-pointer overflow-hidden"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-full max-h-60 object-cover rounded-xl" />
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-[#555]">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">Click to select a photo</p>
                <p className="text-xs mt-1">PNG or JPEG, max 10MB</p>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFile}
              className="hidden"
            />
          </div>

          <Textarea
            label="Caption (optional)"
            placeholder="Describe your photo…"
            rows={3}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <div className="flex gap-3 pt-1">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => { setUploadOpen(false); setPreview(null); setFile(null) }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              loading={uploadMutation.isPending}
              disabled={!file}
              onClick={() => uploadMutation.mutate()}
            >
              Upload
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox.imgUrl}
              alt={lightbox.content}
              className="max-h-[85vh] w-auto object-contain"
            />
            {(lightbox.content || lightbox.likesCount > 0) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {lightbox.content && (
                  <p className="text-sm text-white">{lightbox.content}</p>
                )}
                <div className="flex items-center gap-1.5 mt-1">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs text-[#ccc]">{lightbox.likesCount ?? 0} likes</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
