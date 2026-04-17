import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { memberApi } from '@/api/memberApi'
import { Badge } from '@/components/ui/badge'
import { PageLoader, EmptyState, Dialog } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Textarea, Select } from '@/components/ui/input'
import { UserCog, Pencil, Upload, User, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLE_LABELS = {
  coordinator: 'Coordinator',
  year3: '3rd Year',
  year2: '2nd Year',
  year1: '1st Year',
  default: 'Member',
}
const ROLE_BADGE = { coordinator: 'yellow', year3: 'blue', year2: 'blue', year1: 'blue', default: 'default' }

export default function AdminMembers() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState({})
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [createPhotoFile, setCreatePhotoFile] = useState(null)
  const [createPhotoPreview, setCreatePhotoPreview] = useState(null)
  const [createForm, setCreateForm] = useState({ name: '', description: '', role: 'default', displayed: false })
  const fileRef = useRef()
  const createFileRef = useRef()

  const { data: members, isLoading } = useQuery({
    queryKey: ['admin-members'],
    queryFn: () => memberApi.getAllMembers(),
    select: (r) => r.data.data,
  })

  const openEdit = (m) => {
    setEditTarget(m)
    setForm({ _id: m._id, name: m.name || '', description: m.description || '', role: m.role || 'default', displayed: m.displayed })
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData()
      Object.entries(createForm).forEach(([key, value]) => fd.append(key, value))
      if (createPhotoFile) {
        fd.append('profilePhoto', createPhotoFile)
      }
      return memberApi.createMember(fd)
    },
    onSuccess: () => {
      toast.success('Member created')
      setCreateOpen(false)
      setCreateForm({ name: '', description: '', role: 'default', displayed: false })
      setCreatePhotoFile(null)
      setCreatePhotoPreview(null)
      queryClient.invalidateQueries({ queryKey: ['admin-members'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Create failed'),
  })

  const updateMutation = useMutation({
    mutationFn: async () => {
      await memberApi.updateMember(form)
      if (photoFile) {
        const fd = new FormData()
        fd.append('profilePhoto', photoFile)
        if (editTarget.profilePhoto) {
          await memberApi.replaceProfilePhoto(fd)
        } else {
          await memberApi.uploadProfilePhoto(fd)
        }
      }
    },
    onSuccess: () => {
      toast.success('Member updated')
      setEditTarget(null)
      queryClient.invalidateQueries({ queryKey: ['admin-members'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  })

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F0F0F0]">Members</h1>
          <p className="text-sm text-[#555] mt-0.5">{members?.length ?? 0} club members</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4" /> New Member
        </Button>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : members?.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((m) => (
            <div key={m._id} className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden group">
              {/* Photo */}
              <div className="h-40 bg-[#1C1C1C] overflow-hidden">
                {m.profilePhoto ? (
                  <img src={m.profilePhoto} alt={m.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <User className="w-7 h-7 text-yellow-500/40" />
                    </div>
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-[#F0F0F0] truncate">{m.name || 'Unnamed Member'}</p>
                    <Badge variant={ROLE_BADGE[m.role] ?? 'default'} className="mt-1">
                      {ROLE_LABELS[m.role] ?? m.role}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-xs text-[#555]">
                  <span>{m.photos?.length ?? 0} photos</span>
                  <Badge variant={m.displayed ? 'green' : 'default'}>
                    {m.displayed ? 'Visible' : 'Hidden'}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={UserCog}
          title="No members yet"
          description="Members are created when admins register."
          action={<Button onClick={() => setCreateOpen(true)}><Plus className="w-4 h-4" /> Add Member</Button>}
        />
      )}

      {/* Create Dialog */}
      <Dialog
        open={createOpen}
        onClose={() => {
          setCreateOpen(false)
          setCreatePhotoFile(null)
          setCreatePhotoPreview(null)
          setCreateForm({ name: '', description: '', role: 'default', displayed: false })
        }}
        title="Create Member"
        description="Add a new member profile for the club."
      >
        <div className="space-y-4">
          <div>
            <label className="label">Profile Photo</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#252525] border border-[#2A2A2A] shrink-0">
                {createPhotoPreview ? (
                  <img src={createPhotoPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#555]" />
                  </div>
                )}
              </div>
              <Button variant="surface" size="sm" onClick={() => createFileRef.current?.click()}>
                <Upload className="w-3.5 h-3.5" /> Upload Photo
              </Button>
              <input
                ref={createFileRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0]
                  if (f) {
                    setCreatePhotoFile(f)
                    setCreatePhotoPreview(URL.createObjectURL(f))
                  }
                }}
              />
            </div>
          </div>

          <Input
            label="Display Name"
            placeholder="Full name"
            value={createForm.name}
            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
          />
          <Textarea
            label="Bio / Description"
            placeholder="Short bio about this member…"
            rows={3}
            value={createForm.description}
            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
          />
          <Select
            label="Role"
            value={createForm.role}
            onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
          >
            {Object.entries(ROLE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </Select>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setCreateForm({ ...createForm, displayed: !createForm.displayed })}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${createForm.displayed ? 'bg-yellow-500' : 'bg-[#2A2A2A]'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${createForm.displayed ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-[#888]">Show on Members page</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button
              className="flex-1"
              loading={createMutation.isPending}
              disabled={!createForm.name || !createForm.description}
              onClick={() => createMutation.mutate()}
            >
              Create Member
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Edit Member"
        description={`Update profile for ${editTarget?.name || 'member'}`}
      >
        <div className="space-y-4">
          {/* Photo upload */}
          <div>
            <label className="label">Profile Photo</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#252525] border border-[#2A2A2A] shrink-0">
                {photoPreview || editTarget?.profilePhoto ? (
                  <img src={photoPreview || editTarget?.profilePhoto} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6 text-[#555]" />
                  </div>
                )}
              </div>
              <Button variant="surface" size="sm" onClick={() => fileRef.current?.click()}>
                <Upload className="w-3.5 h-3.5" /> Change Photo
              </Button>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0]
                  if (f) { setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f)) }
                }}
              />
            </div>
          </div>

          <Input
            label="Display Name"
            placeholder="Full name"
            value={form.name || ''}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Textarea
            label="Bio / Description"
            placeholder="Short bio about this member…"
            rows={3}
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Select
            label="Role"
            value={form.role || 'default'}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            {Object.entries(ROLE_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </Select>

          {/* Displayed toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, displayed: !form.displayed })}
              className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${form.displayed ? 'bg-yellow-500' : 'bg-[#2A2A2A]'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${form.displayed ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <span className="text-sm text-[#888]">Show on Members page</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button className="flex-1" loading={updateMutation.isPending} onClick={() => updateMutation.mutate()}>
              Save Changes
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
