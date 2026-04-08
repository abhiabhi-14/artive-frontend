import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/authApi'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog, PageLoader, EmptyState } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Search, Trash2, Shield, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { useDebounce } from '@/hooks/useDebounce'

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const q = useDebounce(search, 300)

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => authApi.getAllUsers(),
    select: (r) => r.data.data,
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => authApi.adminDeleteUser(id),
    onSuccess: () => {
      toast.success('User deleted')
      setDeleteTarget(null)
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  })

  const filtered = users?.filter((u) =>
    !q ||
    u.username.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase()),
  ) ?? []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F0F0F0]">Users</h1>
          <p className="text-sm text-[#555] mt-0.5">{users?.length ?? 0} registered accounts</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 max-w-xs">
        <Input
          leftIcon={Search}
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <PageLoader />
      ) : filtered.length ? (
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-yellow-500 uppercase">{u.username[0]}</span>
                        </div>
                        <span className="font-medium text-[#F0F0F0]">{u.username}</span>
                      </div>
                    </td>
                    <td className="text-[#888]">{u.email}</td>
                    <td>
                      <Badge variant={u.role === 'admin' ? 'yellow' : 'default'}>
                        {u.role === 'admin' ? <Shield className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                        {u.role}
                      </Badge>
                    </td>
                    <td className="text-[#555] text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </td>
                    <td className="text-right">
                      {u._id !== currentUser?._id && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => setDeleteTarget(u)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState icon={Users} title="No users found" description="Try a different search." />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        loading={deleteMutation.isPending}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteTarget?.username}"? This action is permanent.`}
      />
    </div>
  )
}
