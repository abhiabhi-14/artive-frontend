import { cn } from '@/lib/utils'

export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[#2A2A2A] bg-[#141414] shadow-card',
        hover && 'transition-all duration-300 hover:border-yellow-500/30 hover:shadow-yellow hover:-translate-y-0.5 cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('px-6 pt-6 pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn('font-display text-lg font-semibold text-[#F0F0F0]', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('px-6 pb-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('px-6 py-4 border-t border-[#2A2A2A] flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </div>
  )
}
