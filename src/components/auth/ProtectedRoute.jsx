import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PageLoader } from '@/components/ui/badge'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth()
  const location = useLocation()

  if (!isInitialized) return <PageLoader />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isInitialized } = useAuth()
  const location = useLocation()

  if (!isInitialized) return <PageLoader />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export function GuestRoute({ children }) {
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) return <PageLoader />

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
