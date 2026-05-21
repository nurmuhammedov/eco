import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Loader2, User, UserX } from 'lucide-react'
import { apiConfig } from '@/shared/api/constants'
import { useLoginOneId } from '@/entities/auth/models/auth.fetcher'

const PublicInquiryChoice = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const belongId = searchParams.get('belongId')
  const belongType = searchParams.get('belongType')
  const code = searchParams.get('code')
  const stateParam = searchParams.get('state')

  const { mutate: loginOneId, isPending } = useLoginOneId()

  useEffect(() => {
    // Agar OneID dan code qaytib kelgan bo‘lsa
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
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-semibold text-slate-800">Murojaat yuborish turi</h2>
          <p className="mb-8 text-center text-sm text-slate-500">
            Iltimos, murojaat yuborish usulini tanlang. Tizim orqali yuborilganda murojaatingiz holatini kuzatib borish
            imkoni bo‘ladi.
          </p>

          <div className="flex flex-col space-y-4">
            <Button
              size="lg"
              className="h-14 w-full bg-blue-600 text-base hover:bg-blue-700"
              onClick={handleSsoRedirect}
            >
              <User className="mr-2 h-5 w-5" />
              Tizim orqali yuborish (OneID)
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 flex-shrink-0 text-sm text-slate-400">yoki</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <Button
              variant="outline"
              size="lg"
              className="h-14 w-full border-slate-300 text-base text-slate-700 hover:bg-slate-100"
              onClick={handleAnonymous}
            >
              <UserX className="mr-2 h-5 w-5 text-slate-500" />
              Anonim tarzda yuborish
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicInquiryChoice
