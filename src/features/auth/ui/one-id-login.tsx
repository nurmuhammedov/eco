import { useLoginOneId } from '@/entities/auth/models/auth.fetcher'
import { apiConfig } from '@/shared/api/constants'
import { BootScreen } from '@/shared/components/common'

const buildOneIdAuthorizeUrl = () => {
  const { oneIdClientId, oneIdClientSecret, oneIdUrl } = apiConfig

  return `https://sso.egov.uz/sso/oauth/Authorization.do?response_type=one_code&client_id=${oneIdClientId}&client_secret=${oneIdClientSecret}&redirect_uri=${oneIdUrl}`
}

export function OneIdLogin() {
  const { isPending } = useLoginOneId()

  if (isPending) return <BootScreen />

  return (
    <div className="flex h-full min-h-screen w-full flex-1 flex-col items-center justify-center px-4">
      <h1 className="mb-12 text-center text-2xl leading-tight font-medium">Axborot tizimiga kirish</h1>
      <a
        href={buildOneIdAuthorizeUrl()}
        aria-label="OneID orqali kirish"
        className="3xl:px-12 inline-block rounded-2xl bg-neutral-200 px-9 transition-colors hover:bg-neutral-300"
      >
        <img
          src="/id-gov.svg"
          alt="OneID"
          width={128}
          height={80}
          className="3xl:w-36 3xl:h-24 h-16 w-20 lg:h-20 lg:w-32"
        />
      </a>
    </div>
  )
}
