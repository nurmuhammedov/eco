import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import Icon from '@/shared/components/common/icon'
import { apiConfig } from '@/shared/api/constants'
import { useLoginOneId } from '@/entities/auth/models/auth.fetcher'

const PublicInquiryChoice = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const belongId = searchParams.get('belongId')
  const belongType = searchParams.get('belongType')
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')

  const { mutate: loginOneId, isPending } = useLoginOneId({
    disableAutoRun: true,
    customRedirect: () => {},
  })

  useEffect(() => {
    if (code && stateParam) {
      try {
        const decodedStateStr = atob(stateParam)
        const parsedState = JSON.parse(decodedStateStr)

        if (parsedState.from === '/public-inquiry-choice') {
          loginOneId(code, {
            onSuccess: () => {
              navigate(`/inquiries/add?belongId=${parsedState.belongId}&belongType=${parsedState.belongType}`, {
                replace: true,
              })
            },
            onError: () => {
              navigate(`/public-inquiry-choice?belongId=${parsedState.belongId}&belongType=${parsedState.belongType}`, {
                replace: true,
              })
            },
          })
        }
      } catch (err) {
        console.error('State parse error', err)
      }
    }
  }, [code, stateParam, navigate, loginOneId])

  const handleSsoRedirect = () => {
    const stateObj = JSON.stringify({ belongId, belongType, from: '/public-inquiry-choice' })
    const encodedState = btoa(stateObj)
    const redirectUri = `${window.location.origin}/public-inquiry-choice`
    window.location.href = `https://sso.egov.uz/sso/oauth/Authorization.do?response_type=one_code&state=${encodedState}&scope=myportal&client_id=${apiConfig.oneIdClientId}&client_secret=${apiConfig.oneIdClientSecret}&redirect_uri=${redirectUri}`
  }

  const handleAnonymous = () => {
    navigate(`/public-inquiry/form?belongId=${belongId || ''}&belongType=${belongType || ''}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      {isPending ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-muted-foreground text-sm">Tizimga kirilmoqda, kuting...</p>
        </div>
      ) : (
        <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-8 shadow-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center">
              <Icon name="logo" className="h-full w-full object-contain" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi</h1>
            <p className="mt-2 text-sm text-slate-500">Murojaatlar portali</p>
          </div>

          <div className="flex flex-col space-y-5">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4 transition-colors hover:bg-blue-50">
              <Button
                size="lg"
                className="mb-3 h-auto min-h-[3.5rem] w-full bg-blue-600 py-3 text-base whitespace-normal shadow-sm hover:bg-blue-700 sm:py-2"
                onClick={handleSsoRedirect}
              >
                <ShieldCheck className="mr-2 h-5 w-5 shrink-0" />
                <span className="flex flex-col sm:inline sm:flex-none">
                  <span>Ro‘yxatdan o‘tib</span> <span>murojaat yuborish (OneID)</span>
                </span>
              </Button>
              <p className="px-2 text-center text-xs leading-relaxed text-slate-600">
                Ro‘yxatdan o‘tib yuborganingizda, o‘z profilingiz orqali murojaat holatini kuzatib borish va yakuniy
                rasmiy javob xatini onlayn olish imkoniyatiga ega bo‘lasiz. <br />
                <br />{' '}
                <span className="font-semibold text-emerald-700">
                  Shuningdek, xabar qilingan holat o‘z tasdig‘ini topsa va qoidabuzarga jarima qo‘llanilsa, ushbu jarima
                  mablag‘lari hisobidan Sizga tegishli tartibda pul mukofoti to‘lab berilishi mumkin.
                </span>
              </p>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 flex-shrink-0 text-xs font-medium tracking-wider text-slate-400 uppercase">
                yoki
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
              <Button
                variant="outline"
                size="lg"
                className="mb-3 h-auto min-h-[3.5rem] w-full border-slate-300 py-3 text-base whitespace-normal text-slate-700 shadow-sm hover:bg-white sm:py-2"
                onClick={handleAnonymous}
              >
                <EyeOff className="mr-2 h-5 w-5 shrink-0 text-slate-500" />
                <span>Anonim tarzda murojaat yuborish</span>
              </Button>
              <p className="px-2 text-center text-xs leading-relaxed text-slate-600">
                Shaxsiy ma‘lumotlaringiz butunlay sir saqlanadi. Biroq, bu usulda sizga javob xati kelmaydi va murojaat
                qanday hal etilganligini tizim orqali ko‘rib bo‘lmaydi.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicInquiryChoice
