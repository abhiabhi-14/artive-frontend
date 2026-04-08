import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Layout from '@/components/layout/Layout'
import { ProtectedRoute, AdminRoute, GuestRoute } from '@/components/auth/ProtectedRoute'
import { PageLoader } from '@/components/ui/badge'

// ── Public pages ─────────────────────────────────────────
import Home        from '@/pages/Home'
import Login       from '@/pages/Login'
import Register    from '@/pages/Register'
import NotFound    from '@/pages/NotFound'

// ── Lazy-loaded pages ────────────────────────────────────
const Gallery      = lazy(() => import('@/pages/Gallery'))
const Events       = lazy(() => import('@/pages/Events'))
const EventDetail  = lazy(() => import('@/pages/EventDetail'))
const Testimonials = lazy(() => import('@/pages/Testimonials'))
const Members      = lazy(() => import('@/pages/Members'))

// ── Admin pages ───────────────────────────────────────────
const AdminLayout       = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminDashboard    = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminUsers        = lazy(() => import('@/pages/admin/AdminUsers'))
const AdminEvents       = lazy(() => import('@/pages/admin/AdminEvents'))
const AdminPhotos       = lazy(() => import('@/pages/admin/AdminPhotos'))
const AdminMembers      = lazy(() => import('@/pages/admin/AdminMembers'))
const AdminTestimonials = lazy(() => import('@/pages/admin/AdminTestimonials'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>

        {/* ── Auth routes (guests only) ── */}
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        {/* ── Public routes with navbar/footer ── */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/gallery"           element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
          <Route path="/events"            element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/events/:slug"      element={<ProtectedRoute><EventDetail /></ProtectedRoute>} />
          <Route path="/testimonials"      element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
          <Route path="/members"           element={<ProtectedRoute><Members /></ProtectedRoute>} />
        </Route>

        {/* ── Admin routes ── */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index                  element={<AdminDashboard />} />
          <Route path="users"           element={<AdminUsers />} />
          <Route path="events"          element={<AdminEvents />} />
          <Route path="photos"          element={<AdminPhotos />} />
          <Route path="members"         element={<AdminMembers />} />
          <Route path="testimonials"    element={<AdminTestimonials />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Suspense>
  )
}
