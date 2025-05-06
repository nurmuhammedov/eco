import Icon from '@/shared/components/common/icon';
import { useLoginOneId } from '@/entities/auth/models/auth.fetcher.ts';

export default function LoginForm() {
  useLoginOneId();

  return (
    <div className="w-1/2 flex flex-col items-center justify-center">
      <h3 className="mb-4 font-medium text-2xl leading-6 w-1/4 text-center">Axborot tizimiga kirish</h3>
      <a
        href={`https://sso.egov.uz/sso/oauth/Authorization.do?response_type=one_code&client_id=ysn_uztn_uz&redirect_uri=https://ekotizim.cirns.uz/auth/login&scope=myportal&state=testState`}
        className="bg-neutral-200 px-9 3xl:px-12 rounded-2xl inline-block"
      >
        <Icon name="id-gov" className="w-32 h-20 3xl:w-36 3xl:h-24" />
      </a>
    </div>
  );
}
