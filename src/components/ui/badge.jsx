// ─── Badge ────────────────────────────────────────────────
import { cn } from '@/lib/utils'
import { X, Loader2 } from 'lucide-react'
import { useEffect } from 'react'

export function Badge({ className, variant = 'default', children, ...props }) {
  const variants = {
    default: 'bg-white/5 text-[#888] border border-[#2A2A2A]',
    yellow:  'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
    green:   'bg-green-500/15 text-green-400 border border-green-500/20',
    red:     'bg-red-500/15 text-red-400 border border-red-500/20',
    blue:    'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant] ?? variants.default,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// ─── Spinner ──────────────────────────────────────────────
export function Spinner({ className, size = 'md' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' }
  return (
    <Loader2
      className={cn('animate-spin text-yellow-500', sizes[size] ?? sizes.md, className)}
    />
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-[#555] font-body animate-pulse">Loading…</p>
      </div>
    </div>
  )
}

// ─── Dialog / Modal ───────────────────────────────────────
export function Dialog({ open, onClose, title, description, children, className }) {
  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div
        className={cn(
          'relative z-10 w-full max-w-lg rounded-2xl border border-[#2A2A2A] bg-[#141414] shadow-2xl animate-fade-up',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-[#2A2A2A]">
          <div>
            {title && (
              <h2 className="font-display text-lg font-semibold text-[#F0F0F0]">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-[#888]">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1.5 rounded-lg text-[#555] hover:text-[#F0F0F0] hover:bg-[#252525] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

// ─── Confirm Dialog ───────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, description, loading }) {
  return (
    <Dialog open={open} onClose={onClose} title={title} description={description}>
      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-[#888] hover:text-[#F0F0F0] hover:bg-[#252525] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Delete
        </button>
      </div>
    </Dialog>
  )
}

// ─── Empty State ──────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4">
          <Icon className="w-7 h-7 text-yellow-500/60" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-[#F0F0F0] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#666] max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
