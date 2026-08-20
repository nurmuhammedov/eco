import { cn } from '@/shared/lib/utils'
import { BrandLogo } from '@/shared/components/common/brand-logo'

// Mirrors the inline `#app-boot` markup in index.html so React's first paint does not flicker.
export const BootScreen = ({ className }: { className?: string }) => (
  <div
    className={cn(
      'flex h-full min-h-screen w-full flex-1 flex-col items-center justify-center gap-6 bg-white',
      className
    )}
  >
    <BrandLogo className="size-24" />
    <div className="bg-teal/15 h-[3px] w-45 overflow-hidden rounded-full">
      <div className="bg-teal animate-route-progress h-full origin-left" />
    </div>
    <span className="sr-only" role="status">
      Yuklanmoqda
    </span>
  </div>
)

export default BootScreen
