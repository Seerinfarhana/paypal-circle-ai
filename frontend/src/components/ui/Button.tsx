import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[transform,background-color,box-shadow,color] duration-200 ease-[cubic-bezier(.34,1.56,.64,1)] active:scale-[.97] disabled:cursor-not-allowed disabled:active:scale-100',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-white shadow-[0_8px_20px_-8px_rgba(0,112,224,.7)] hover:bg-brand-dark hover:-translate-y-px disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none disabled:translate-y-0',
        navy: 'bg-navy text-white hover:bg-[#00268a] hover:-translate-y-px disabled:bg-slate-200 disabled:text-slate-500',
        secondary: 'bg-white text-ink border border-slate-200 hover:border-brand/50 hover:bg-mist disabled:text-slate-400',
        ghost: 'text-muted hover:bg-slate-100 hover:text-ink',
        soft: 'bg-brand/10 text-brand-dark hover:bg-brand/15',
        danger: 'bg-white text-bad border border-bad/30 hover:bg-bad-soft',
        light: 'bg-white text-navy hover:bg-mist hover:-translate-y-px',
      },
      size: { sm: 'h-9 px-3.5 text-sm rounded-xl', md: 'h-11 px-5 text-[15px] rounded-2xl', lg: 'h-12 px-6 text-base rounded-2xl', icon: 'h-10 w-10 rounded-xl' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, type = 'button', ...p }, ref) => (
  <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...p} />
))
Button.displayName = 'Button'
