import { FC } from 'react'
import { cn } from '@/shared/lib/utils'

// Served as a static file so it stays out of the JS bundle and shares a cache entry with the landing page.
export const BrandLogo: FC<{ className?: string }> = ({ className }) => (
  <img
    src="/brand-logo.webp"
    alt="Sanoat, radiatsiya va yadro xavfsizligi qo'mitasi gerbi"
    width={480}
    height={478}
    loading="eager"
    decoding="async"
    draggable={false}
    className={cn('rounded-full object-contain select-none', className)}
  />
)
