import { FC } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/app/i18-next'

export const withLanguage = (Component: FC) => {
  return () => (
    <I18nextProvider i18n={i18n}>
      <Component />
    </I18nextProvider>
  )
}
