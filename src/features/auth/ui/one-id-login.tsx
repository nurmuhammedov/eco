import { useLoginOneId } from '@/entities/auth/models/auth.fetcher'
import Icon from '@/shared/components/common/icon'
import { apiConfig } from '@/shared/api/constants'

export function OneIdLogin() {
  const { oneIdClientId, oneIdClientSecret, oneIdUrl } = apiConfig
  useLoginOneId()

  return (
    <div className="flex h-full min-h-screen w-full flex-1 flex-col items-center justify-center">
      <h3 className="mb-12 text-center text-2xl leading-6 font-medium">Axborot tizimiga kirish</h3>
      <a
        className="3xl:px-12 inline-block rounded-2xl bg-neutral-200 px-9"
        href={`https://sso.egov.uz/sso/oauth/Authorization.do?response_type=one_code&client_id=${oneIdClientId}&client_secret=${oneIdClientSecret}&redirect_uri=${oneIdUrl}`}
      >
        <Icon name="id-gov" className="3xl:w-36 3xl:h-24 h-16 w-20 lg:h-20 lg:w-32" />
      </a>
    </div>
  )
}
