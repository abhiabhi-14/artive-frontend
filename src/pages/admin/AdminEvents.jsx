import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventApi } from '@/api/eventApi'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog, PageLoader, EmptyState, Dialog } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { CalendarDays, Plus, Trash2, Upload, X, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const EMPTY_FORM = { name: '', description: '', rules: '', teamSize: 3, venue: '', dateOfEvent: '' }

export default function AdminEvents() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const fileRef = useRef()

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const { data, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventApi.getAllEvents({ pagination: 'true', limit: 50 }),
    select: (r) => r.data.data,
  })

  const createMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      files.forEach((file) => fd.append('image', file))
      return eventApi.createEvent(fd)
    },
    onSuccess: () => {
      toast.success('Event created!')
      setCreateOpen(false)
      setForm(EMPTY_FORM)
      setFiles([])
      setPreviews([])
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Create failed'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => eventApi.deleteEvent(id),
    onSuccess: () => {
      toast.success('Event deleted')
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  })

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files).slice(0, 5)
    setFiles(newFiles)
    setPreviews(newFiles.map((f) => URL.createObjectURL(f)))
  }

  const removePreview = (i) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i))
    setPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  const events = data?.events ?? []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F0F0F0]">Events</h1>
          <p className="text-sm text-[#555] mt-0.5">{data?.totalEvents ?? 0} events total</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> New Event
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <PageLoader />
      ) : events.length ? (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const isPast = new Date(ev.dateOfEvent) < new Date()
                  return (
                    <tr key={ev._id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          {ev.photos?.[0] ? (
                            <img src={ev.photos[0]} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#252525] flex items-center justify-center shrink-0">
                              <CalendarDays className="w-3.5 h-3.5 text-[#555]" />
                            </div>
                          )}
                          <span className="font-medium text-[#F0F0F0] line-clamp-1">{ev.name}</span>
                        </div>
                      </td>
                      <td className="text-[#888] text-xs max-w-[120px] truncate">{ev.venue}</td>
                      <td className="text-[#888] text-xs whitespace-nowrap">
                        {new Date(ev.dateOfEvent).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </td>
                      <td className="text-[#888] text-xs">{ev.teamSize}</td>
                      <td>
                        <Badge variant={isPast ? 'default' : 'green'}>
                          {isPast ? 'Done' : 'Upcoming'}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/events/${ev.slug}`} target="_blank">
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setDeleteTarget(ev)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Create your first event to get started."
          action={<Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> New Event</Button>}
        />
      )}

      {/* ── Create Dialog ── */}
      <Dialog
        open={createOpen}
        onClose={() => { setCreateOpen(false); setFiles([]); setPreviews([]) }}
        title="Create Event"
        description="Fill in the event details below."
        className="max-w-2xl"
      >
        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Event Name" placeholder="Photography Walk" value={form.name} onChange={f('name')} />
            <Input label="Venue" placeholder="Main Campus Quad" value={form.venue} onChange={f('venue')} />
          </div>

          <Textarea label="Description" placeholder="Tell participants what this event is about…" rows={3} value={form.description} onChange={f('description')} />
          <Textarea label="Rules & Guidelines" placeholder="Rules for participation…" rows={3} value={form.rules} onChange={f('rules')} />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Date of Event" type="date" value={form.dateOfEvent} onChange={f('dateOfEvent')} />
            <Input label="Team Size" type="number" min={1} value={form.teamSize} onChange={f('teamSize')} />
          </div>

          {/* Photos */}
          <div>
            <label className="label">Event Photos (up to 5)</label>
            {previews.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#2A2A2A]">
                    <img src={src} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePreview(i)}
                      className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/60 text-white hover:bg-red-500/80"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <div
              onClick={() => fileRef.current?.click()}
              className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-[#2A2A2A] hover:border-yellow-500/40 cursor-pointer transition-colors text-[#555] hover:text-yellow-500"
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">Add photos (PNG/JPEG)</span>
            </div>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg" multiple onChange={handleFiles} className="hidden" />
          </div>
        </div>

        <div className="flex gap-3 pt-4 mt-2 border-t border-[#2A2A2A]">
          <Button variant="ghost" className="flex-1" onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            className="flex-1"
            loading={createMutation.isPending}
            disabled={!form.name || !form.venue || !form.dateOfEvent || !files.length}
            onClick={() => createMutation.mutate()}
          >
            Create Event
          </Button>
        </div>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        loading={deleteMutation.isPending}
        title="Delete Event"
        description={`Permanently delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  )
}
