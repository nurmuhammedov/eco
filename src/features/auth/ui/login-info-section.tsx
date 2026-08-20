import { Mail, Phone, Send } from 'lucide-react'
import { BrandLogo } from '@/shared/components/common'

const CONTACTS = [
  { href: 'https://t.me/ekotizim_cirns', icon: Send, label: 'Telegram', external: true },
  { href: 'tel:+998712030239', icon: Phone, label: '+998 (71) 203-02-39', external: false },
  { href: 'mailto:info@cirns.uz', icon: Mail, label: 'info@cirns.uz', external: false },
]

export const LoginInfoSection = () => (
  <div className="bg-teal scrollbar-hidden hidden min-h-screen flex-1 flex-col items-center justify-between overflow-y-auto p-4 lg:flex">
    <div className="flex flex-grow flex-col items-center justify-center">
      <h2 className="3xl:text-2xl mb-8 max-w-lg text-center text-xl font-semibold text-white">
        O‘zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi
      </h2>

      <BrandLogo className="3xl:size-60 size-44 max-w-full" />

      <div className="mt-16 max-w-full text-center text-white">
        <p className="3xl:text-3xl my-2 text-2xl font-bold tracking-wide">&laquo;Sanoat xavfsizligi ekotizimi&raquo;</p>
        <p className="3xl:text-2xl text-xl opacity-70">axborot tizimi</p>
      </div>
    </div>

    <div className="mt-4 flex w-full flex-col items-center justify-center gap-x-6 gap-y-2 text-white/80 lg:flex-row">
      {CONTACTS.map(({ href, icon: Icon, label, external }) => (
        <a
          key={label}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="flex items-center gap-2 transition-colors hover:text-white"
        >
          <Icon className="size-4" aria-hidden="true" />
          <span className="text-sm font-medium whitespace-nowrap">{label}</span>
        </a>
      ))}
    </div>
  </div>
)
