import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export const Input = forwardRef(function Input(
  { className, label, error, hint, leftIcon: LeftIcon, rightIcon: RightIcon, ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-[#888] mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none">
            <LeftIcon className="w-4 h-4" />
          </span>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border bg-[#1C1C1C] px-4 py-2.5 text-sm text-[#F0F0F0]',
            'placeholder:text-[#555] focus:outline-none transition-all duration-200',
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
              : 'border-[#2A2A2A] focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20',
            LeftIcon  && 'pl-9',
            RightIcon && 'pr-9',
            className,
          )}
          {...props}
        />
        {RightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]">
            <RightIcon className="w-4 h-4" />
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-[#666]">{hint}</p>}
    </div>
  )
})

export const Textarea = forwardRef(function Textarea(
  { className, label, error, ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-[#888] mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-[#1C1C1C] px-4 py-2.5 text-sm text-[#F0F0F0]',
          'placeholder:text-[#555] focus:outline-none transition-all duration-200 resize-none',
          error
            ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
            : 'border-[#2A2A2A] focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20',
          className,
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
})

export const Select = forwardRef(function Select(
  { className, label, error, children, ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-[#888] mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-[#1C1C1C] px-4 py-2.5 text-sm text-[#F0F0F0]',
          'focus:outline-none transition-all duration-200',
          'border-[#2A2A2A] focus:border-yellow-500/60 focus:ring-1 focus:ring-yellow-500/20',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
})
