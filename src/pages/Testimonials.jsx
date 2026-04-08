import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { testimonialApi } from '@/api/testimonialApi'
import { TestimonialCard } from '@/components/shared/TestimonialCard'
import { PageLoader, EmptyState, Dialog } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { Quote, Plus, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Testimonials() {
  const { isAuthenticated, isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ description: '' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => testimonialApi.getAllTestimonials(),
    select: (res) => res.data.data ?? [],
  })

  const createMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('description', form.description)
      return testimonialApi.createTestimonial(fd)
    },
    onSuccess: () => {
      toast.success('Testimonial submitted!')
      setOpen(false)
      setFile(null)
      setPreview(null)
      setForm({ description: '' })
      queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Submission failed')
    },
  })

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="accent-line mb-3" />
            <h1 className="section-title">Member Voices</h1>
            <p className="section-subtitle">Stories from the Artive community</p>
          </div>
          {isAuthenticated && (
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4" /> Share Story
            </Button>
          )}
        </div>

        {/* ── Grid ── */}
        {isLoading ? (
          <PageLoader />
        ) : testimonials?.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <TestimonialCard key={t._id} testimonial={t} adminView={isAdmin} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Quote}
            title="No testimonials yet"
            description="Be the first to share your Artive experience."
            action={
              isAuthenticated && (
                <Button onClick={() => setOpen(true)}>
                  <Plus className="w-4 h-4" /> Share Your Story
                </Button>
              )
            }
          />
        )}
      </div>

      {/* ── Submit Dialog ── */}
      <Dialog
        open={open}
        onClose={() => { setOpen(false); setFile(null); setPreview(null) }}
        title="Share Your Story"
        description="Tell the community what Artive means to you."
      >
        <div className="space-y-4">
          {/* Photo */}
          <div>
            <label className="label">Profile Photo</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-[#2A2A2A] hover:border-yellow-500/40 cursor-pointer transition-colors"
            >
              {preview ? (
                <img src={preview} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#252525] flex items-center justify-center">
                  <Upload className="w-4 h-4 text-[#555]" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[#F0F0F0]">
                  {file ? file.name : 'Upload a photo'}
                </p>
                <p className="text-xs text-[#555]">PNG or JPEG</p>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files[0]
                if (f) { setFile(f); setPreview(URL.createObjectURL(f)) }
              }}
            />
          </div>

          <Textarea
            label="Your Story"
            placeholder="What has being part of Artive meant to you? (min 3, max 200 chars)"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ description: e.target.value })}
            error={
              form.description.length > 200
                ? `${form.description.length}/200 characters`
                : undefined
            }
          />

          <div className="flex gap-3 pt-1">
            <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              loading={createMutation.isPending}
              disabled={!file || form.description.length < 3 || form.description.length > 200}
              onClick={() => createMutation.mutate()}
            >
              Submit
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
