import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Camera, Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ usernameOrEmail: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.usernameOrEmail) e.usernameOrEmail = 'Username or email is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    const result = await login(form)
    if (result.type === 'auth/login/fulfilled') {
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0A0A0A] hero-mesh">
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
            <h1 className="font-display text-2xl font-bold text-[#F0F0F0]">Welcome back</h1>
            <p className="text-sm text-[#666] mt-1">Sign in to your Artive account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username or Email"
              placeholder="yourname or you@example.com"
              value={form.usernameOrEmail}
              onChange={(e) => setForm({ ...form, usernameOrEmail: e.target.value })}
              error={errors.usernameOrEmail}
              autoComplete="username"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 bottom-2.5 text-[#555] hover:text-[#F0F0F0] transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              <LogIn className="w-4 h-4" /> Sign In
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-[#666]">
              Don't have an account?{' '}
              <Link to="/register" className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors">
                Join the club
              </Link>
            </p>
          </div>
        </div>

        {/* Decorative bar */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="h-px flex-1 bg-[#1C1C1C]" />
          <span className="text-xs text-[#444]">Artive Creative Club</span>
          <div className="h-px flex-1 bg-[#1C1C1C]" />
        </div>
      </div>
    </div>
  )
}
