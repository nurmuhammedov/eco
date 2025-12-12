import { Mail, Phone, Send } from 'lucide-react'
import Icon from '@/shared/components/common/icon'

export const LoginInfoSection = () => {
  return (
    <div className="scrollbar-hidden hidden min-h-screen flex-1 flex-col items-center justify-between overflow-y-auto bg-[url(@/shared/assets/images/login-hero.png)] bg-cover bg-no-repeat p-4 lg:flex">
      <div className="flex flex-grow flex-col items-center justify-center">
        <h4 className="3xl:font-bold 3xl:text-2xl mb-8 max-w-lg text-center text-xl font-semibold text-white">
          O‘zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi
        </h4>
        <Icon name="logo" className="3xl:size-60 size-44 max-w-full text-white" />
        <div className="mt-16 max-w-full text-center text-white">
          {/*<h6 className="3xl:text-2xl text-xl opacity-70">Sanoat, radiatsiya va yadro xavfsizligi sohasida</h6>*/}
          <p className="3xl:text-3xl my-2 text-2xl font-bold tracking-wide">
            &laquo;Sanoat xavfsizligi ekotizimi&raquo;
          </p>
          <h6 className="3xl:text-2xl text-xl opacity-70">axborot tizimi</h6>
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-x-6 gap-y-2 text-white/80 lg:flex-row">
        <a
          href="https://t.me/ekotizim_cirns"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 transition-all hover:text-white hover:opacity-100"
        >
          <Send className="size-4" />
          <span className="text-sm font-medium">Telegram</span>
        </a>
        <a
          href="tel:+998712030239"
          className="flex items-center gap-2 transition-all hover:text-white hover:opacity-100"
        >
          <Phone className="size-4" />
          <span className="text-sm font-medium whitespace-nowrap">+998 (71) 203-02-39</span>
        </a>
        <a
          href="mailto:info@cirns.uz"
          className="flex items-center gap-2 transition-all hover:text-white hover:opacity-100"
        >
          <Mail className="size-4" />
          <span className="text-sm font-medium">info@cirns.uz</span>
        </a>
      </div>
    </div>
  )
}
