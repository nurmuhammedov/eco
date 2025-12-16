import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { FC, memo, useEffect, useRef } from 'react'
import { StandaloneLoaderProps } from '../model/types'

const isBrowser = typeof window !== 'undefined'

export const Loader: FC<StandaloneLoaderProps> = memo(({ message, size = 40, bgOpacity = 0, isVisible = false }) => {
  const { t } = useTranslation('common')
  const didLockScroll = useRef(false)

  useEffect(() => {
    if (!isBrowser) return

    if (isVisible) {
      didLockScroll.current = true
      const originalStyle = window.getComputedStyle(document.body).overflow
      const originalPaddingRight = window.getComputedStyle(document.body).paddingRight
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`
      }
      return () => {
        if (didLockScroll.current) {
          window.setTimeout(() => {
            document.body.style.overflow = originalStyle
            document.body.style.paddingRight = originalPaddingRight
            didLockScroll.current = false
          }, 100)
        }
      }
    }
    return undefined
  }, [isVisible])

  if (!isVisible) return null

  const bgColorClass = `bg-black/${bgOpacity}`
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="standalone-loading-title"
      className={`fixed inset-0 z-50 flex items-center justify-center ${bgColorClass} backdrop-blur-xl transition-all duration-300 ease-in-out`}
    >
      <div className={`flex max-w-sm transform flex-col items-center transition-transform duration-300 ease-in-out`}>
        <Loader2 size={size} aria-hidden="true" className="text-teal mb-4 animate-spin" />

        {message && (
          <p id="standalone-loading-title" className="text-center font-medium text-gray-800">
            {t(message)}
          </p>
        )}
      </div>
    </div>
  )
})

Loader.displayName = 'Loader'
export default Loader
