import { Link } from 'react-router-dom';
import AppLogo from '@/shared/assets/images/logo.svg';
import IDLogo from '@/shared/assets/images/id-gov.svg';

export default function Login() {
  return (
    <section className="flex h-screen font-inter">
      <div className="w-1/2 flex flex-col items-center justify-center pt-20 pb-8 bg-no-repeat bg-cover bg-[url(@/shared/assets/images/login-hero.png)]">
        <div className="flex flex-col items-center justify-center">
          <h4 className="text-white max-w-lg text-center font-bold text-2xl mb-8">
            O&rsquo;zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Sanoat,
            radiatsiya va&nbsp;yadro xavfsizligi qo&lsquo;mitasi
          </h4>
          <img
            width={230}
            height={230}
            src={AppLogo}
            alt="logo"
            className="size-56"
          />
        </div>
        <div className="max-w-md text-center text-white mt-20">
          <h6 className="text-2xl opacity-50">
            Саноат, радиация ва&nbsp;ядро хавфсизлиги соҳасида
          </h6>
          <p className="text-3xl font-semibold opacity-100">
            &laquo;Ягона интеграциялашган экотизим&raquo;
          </p>
          <h6 className="text-2xl opacity-50">ахборот тизими</h6>
        </div>
      </div>
      <div className="w-1/2 flex flex-col items-center justify-center">
        <h3 className="mb-4 font-medium text-2xl">Tizimga kirish</h3>
        <Link
          to="/app/applications"
          className="bg-neutral-200 px-12 py-3 rounded-2xl inline-block"
        >
          <img
            width={144}
            height={35}
            src={IDLogo}
            alt="ID Logo"
            className="bg--neutral-900"
          />
        </Link>
      </div>
    </section>
  );
}
