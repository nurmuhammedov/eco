import { memo } from 'react'
import { RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Icon from '@/shared/components/common/icon'
import { Button } from '@/shared/components/ui/button'
import { ErrorAction, ErrorFallbackProps } from '@/pages/error/types'

const DEFAULT_ERROR_MESSAGE = 'errors.unexpected_error'
const DEFAULT_SOMETHING_WENT_WRONG = 'errors.something_went_wrong'

export const DefaultErrorFallback = memo(({ error, reloadPage, isDev, errorInfo }: ErrorFallbackProps) => {
  const { t } = useTranslation()

  const actions: ErrorAction[] = [
    {
      label: t('actions.reload'),
      icon: RefreshCw,
      action: reloadPage,
      variant: 'default',
    },
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full max-w-2xl p-8 text-center">
        <div className="flex justify-center">
          <Icon name="server-down" className="size-72" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">{t(DEFAULT_SOMETHING_WENT_WRONG)}</h2>

        <p className="my-4 text-gray-600">{error?.message || t(DEFAULT_ERROR_MESSAGE)}</p>

        {isDev && errorInfo && (
          <div className="mb-6 text-left">
            <details className="max-h-72 overflow-auto rounded-lg bg-gray-200 p-4 text-sm">
              <summary className="cursor-pointer font-medium">{t('errors.view_details')}</summary>
              <pre className="text-xs break-words whitespace-pre-wrap text-red-600">{error?.stack}</pre>
              <pre className="mt-4 text-xs break-words whitespace-pre-wrap text-gray-700">
                {errorInfo.componentStack}
              </pre>
            </details>
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              variant={action.variant}
              className="flex items-center justify-center"
            >
              <RefreshCw />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
})

DefaultErrorFallback.displayName = 'DefaultErrorFallback'
