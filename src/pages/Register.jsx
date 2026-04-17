import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Camera, Eye, EyeOff, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Register() {
  const { register, isLoading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '',
    role: 'user', key: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const validate = () => {
    const e = {}
    if (!form.username || form.username.length < 3) e.username = 'At least 3 characters'
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Only letters, numbers, underscores'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (form.password.length < 8) e.password = 'At least 8 characters'
    if (!/\d/.test(form.password)) e.password = 'Must include a number'
    if (!/[A-Z]/.test(form.password)) e.password = 'Must include an uppercase letter'
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) e.password = 'Must include a special character'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (form.role === 'admin' && !form.key) e.key = 'Admin key required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const payload = { username: form.username, email: form.email, password: form.password, role: form.role }
    if (form.role === 'admin') payload.key = form.key

    const result = await register(payload)
    if (result.type === 'auth/register/fulfilled') {
      toast.success('Account created! Please log in.')
      navigate('/login')
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0A0A0A] hero-mesh">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center shadow-yellow">
              <Camera className="w-5 h-5 text-black" />
            </div>
            <span className="font-display text-2xl font-bold text-[#F0F0F0]">
              Artive<span className="text-yellow-500">.</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-8 shadow-2xl">
          <div className="mb-7">
            <h1 className="font-display text-2xl font-bold text-[#F0F0F0]">Join Artive</h1>
            <p className="text-sm text-[#666] mt-1">Create your account to start creating</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              placeholder="your_handle"
              value={form.username}
              onChange={f('username')}
              error={errors.username}
              autoComplete="username"
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={f('email')}
              error={errors.email}
              autoComplete="email"
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
                value={form.password}
                onChange={f('password')}
                error={errors.password}
                autoComplete="new-password"
                hint="Min 8 chars · 1 uppercase · 1 number · 1 special char"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 bottom-2.5 text-[#555] hover:text-[#F0F0F0] transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Input
              label="Confirm Password"
              type={showPass ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={f('confirmPassword')}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <Select
              label="Account Type"
              value={form.role}
              onChange={f('role')}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Select>

            {form.role === 'admin' && (
              <Input
                label="Admin Key"
                type="password"
                placeholder="Enter the admin key"
                value={form.key}
                onChange={f('key')}
                error={errors.key}
                hint="Contact club management to get the admin key."
              />
            )}

            <Button type="submit" className="w-full" loading={isLoading}>
              <UserPlus className="w-4 h-4" /> Create Account
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-[#666]">
              Already a member?{' '}
              <Link to="/login" className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-[#1C1C1C]" />
          <span className="text-xs text-[#444]">Artive Creative Club</span>
          <div className="h-px flex-1 bg-[#1C1C1C]" />
        </div>
      </div>
    </div>
  )
}
