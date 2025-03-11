import { memo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Icon from '@/shared/components/common/icon';
import { Button } from '@/shared/components/ui/button';
import { ErrorAction, ErrorFallbackProps } from '../types';

const DEFAULT_ERROR_MESSAGE = 'errors.unexpected_error';
const DEFAULT_SOMETHING_WENT_WRONG = 'errors.something_went_wrong';

export const DefaultErrorFallback = memo(
  ({ error, reloadPage, isDev, errorInfo }: ErrorFallbackProps) => {
    const { t } = useTranslation();

    const actions: ErrorAction[] = [
      {
        label: t('actions.reload'),
        icon: RefreshCw,
        action: reloadPage,
        variant: 'default',
      },
    ];

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full max-w-2xl p-8 text-center">
          <div className="flex justify-center">
            <Icon name="server-down" className="size-72" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            {t(DEFAULT_SOMETHING_WENT_WRONG)}
          </h2>

          <p className="text-gray-600 my-4">
            {error?.message || t(DEFAULT_ERROR_MESSAGE)}
          </p>

          {isDev && errorInfo && (
            <div className="mb-6 text-left">
              <details className="bg-gray-200 p-4 rounded-lg text-sm overflow-auto max-h-72">
                <summary className="font-medium cursor-pointer">
                  {t('errors.view_details')}
                </summary>
                <pre className="whitespace-pre-wrap break-words text-red-600 text-xs">
                  {error?.stack}
                </pre>
                <pre className="whitespace-pre-wrap break-words text-gray-700 mt-4 text-xs">
                  {errorInfo.componentStack}
                </pre>
              </details>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
    );
  },
);

DefaultErrorFallback.displayName = 'DefaultErrorFallback';
