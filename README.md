# Artive Frontend

A production-grade React frontend for the Artive College Creative Club — built with Vite, React 18, Redux Toolkit, TanStack Query, Tailwind CSS, and a custom yellow dark theme.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Dev server & bundler |
| **React Router v6** | Routing with lazy loading |
| **Redux Toolkit** | Auth state management |
| **TanStack React Query v5** | Server state, caching, mutations |
| **Axios** | HTTP client with interceptors |
| **Tailwind CSS v3** | Utility-first styling |
| **react-hot-toast** | Toast notifications |
| **lucide-react** | Icons |

---

## Project Structure

```
src/
├── api/                  # All API call functions
│   ├── axiosInstance.js  # Axios base with token refresh interceptor
│   ├── authApi.js
│   ├── eventApi.js
│   ├── photoApi.js
│   ├── memberApi.js
│   ├── testimonialApi.js
│   └── likeApi.js
│
├── store/                # Redux Toolkit
│   ├── index.js          # Store config
│   └── slices/
│       └── authSlice.js  # Auth state + async thunks
│
├── hooks/
│   ├── useAuth.js        # Auth hook (wraps Redux dispatch/selectors)
│   └── useDebounce.js    # Debounce helper
│
├── lib/
│   └── utils.js          # cn() classname helper
│
├── components/
│   ├── ui/               # Primitive components
│   │   ├── button.jsx
│   │   ├── input.jsx     # Input, Textarea, Select
│   │   ├── card.jsx
│   │   └── badge.jsx     # Badge, Spinner, Dialog, ConfirmDialog, EmptyState
│   ├── layout/
│   │   ├── Layout.jsx    # Outlet wrapper with Navbar + Footer
│   │   ├── Navbar.jsx    # Sticky nav with user dropdown
│   │   └── Footer.jsx
│   ├── auth/
│   │   └── ProtectedRoute.jsx  # ProtectedRoute, AdminRoute, GuestRoute
│   └── shared/
│       ├── PhotoCard.jsx
│       ├── EventCard.jsx
│       └── TestimonialCard.jsx  # Also exports MemberCard
│
├── pages/
│   ├── Home.jsx           # Landing page
│   ├── Gallery.jsx        # Masonry photo grid + upload
│   ├── Events.jsx         # Events list + search
│   ├── EventDetail.jsx    # Single event view
│   ├── Testimonials.jsx   # Testimonials + submit
│   ├── Members.jsx        # Public members page
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── NotFound.jsx
│   └── admin/
│       ├── AdminLayout.jsx     # Sidebar + Outlet
│       ├── AdminDashboard.jsx  # Stats overview
│       ├── AdminUsers.jsx      # User management
│       ├── AdminEvents.jsx     # Event CRUD
│       ├── AdminPhotos.jsx     # Photo grid + delete
│       ├── AdminMembers.jsx    # Member profiles + edit
│       └── AdminTestimonials.jsx
│
├── App.jsx               # Route tree
├── AppInit.jsx           # Session restore on load
├── main.jsx              # React root + Provider setup
└── index.css             # Global styles + design tokens
```

---

## Quick Start

### 1. Clone & install

```bash
cd artive-frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 3. Run the dev server

Make sure your backend is running on port `8000`, then:

```bash
npm run dev
```

Frontend → http://localhost:5173

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## Backend API Map

All calls go through `src/api/axiosInstance.js` which:
- Attaches `Authorization: Bearer <token>` from localStorage
- Auto-refreshes expired tokens using `/users/generate-token`
- Redirects to `/login` on hard auth failure

| Frontend Page | Backend Endpoints Used |
|---|---|
| Login / Register | `POST /users/login`, `POST /users/register` |
| Gallery | `GET /photo/all-photo`, `POST /photo/create`, `DELETE /photo/delete/:id` |
| Events | `GET /event/all-events`, `GET /event/search`, `GET /event/get-events/:slug` |
| Testimonials | `GET /testimonial/all-Testimonials`, `POST /testimonial/create`, `DELETE /testimonial/delete/:id` |
| Members | `GET /members/all-members` |
| Likes | `POST /likes/photo/:id`, `DELETE /likes/delete/photo/:id`, etc. |
| Admin Dashboard | All of the above + admin-specific routes |

---

## Auth Flow

1. User logs in → access token stored in `localStorage` + httpOnly cookie
2. `AppInit` fires `fetchCurrentUser` on every page load to restore session
3. Token expiry → Axios interceptor calls `/users/generate-token` once, retries request
4. Hard 401 → localStorage cleared, redirect to `/login`
5. `ProtectedRoute` / `AdminRoute` guard pages based on Redux `isAuthenticated` + `role`

---

## Design System

- **Font**: Playfair Display (headings) + DM Sans (body)
- **Primary**: `#F5C518` (yellow-500)
- **Background**: `#0A0A0A` → `#141414` → `#1C1C1C` surface layers
- **CSS Variables**: Defined in `:root` inside `index.css`
- All colors, shadows, and animations are in `tailwind.config.js`
