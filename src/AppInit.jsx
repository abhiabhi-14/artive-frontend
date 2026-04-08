import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/badge'

/**
 * AppInit runs once on mount and tries to restore the user's session
 * using the stored access token. Only renders children once initialized.
 */
export default function AppInit({ children }) {
  const { fetchUser, isInitialized } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      fetchUser()
    } else {
      // Mark as initialized so routes don't stay stuck on loader
      fetchUser().catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Show full-screen loader until we know auth state
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0A0A0A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500 flex items-center justify-center shadow-yellow-lg">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="space-y-1 text-center">
            <p className="font-display text-lg font-bold text-[#F0F0F0]">
              Artive<span className="text-yellow-500">.</span>
            </p>
            <p className="text-xs text-[#444] animate-pulse">Loading your session…</p>
          </div>
        </div>
      </div>
    )
  }

  return children
}
