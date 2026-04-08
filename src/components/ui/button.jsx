import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-body text-sm transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 select-none',
  {
    variants: {
      variant: {
        primary:  'bg-yellow-500 text-black hover:bg-yellow-400 shadow-yellow',
        outline:  'border border-yellow-500/40 text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500',
        ghost:    'text-[#888] hover:text-[#F0F0F0] hover:bg-[#252525]',
        danger:   'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500',
        surface:  'bg-[#1C1C1C] border border-[#2A2A2A] text-[#F0F0F0] hover:bg-[#252525] hover:border-[#3A3A3A]',
        success:  'bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20',
      },
      size: {
        sm:   'px-3 py-1.5 text-xs',
        md:   'px-5 py-2.5',
        lg:   'px-7 py-3 text-base',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export function Button({
  className,
  variant,
  size,
  loading = false,
  children,
  ...props
}) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  )
}
