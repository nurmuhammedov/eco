import Icon from '@/shared/components/common/icon';

export const LoginInfoSection = () => {
  return (
    <div className="w-1/2 flex flex-col items-center justify-center pt-20 pb-8 bg-no-repeat bg-cover bg-[url(@/shared/assets/images/login-hero.png)]">
      <div className="flex flex-col items-center justify-center">
        <h4 className="text-white px-4 max-w-lg text-center font-semibold 3xl:font-bold text-xl 3xl:text-2xl mb-8">
          O‘zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi
        </h4>
        <Icon name="logo" className="size-44 3xl:size-60" />
      </div>
      <div className="max-w-full text-center text-white mt-20 px-4">
        <h6 className="text-xl 3xl:text-2xl opacity-50">Sanoat, radiatsiya va yadro xavfsizligi sohasida</h6>
        <p className="text-2xl 3xl:text-3xl font-semibold opacity-100">
          &laquo;Yagona integratsiyalashgan ekotizim&raquo;
        </p>
        <h6 className="text-xl 3xl:text-2xl opacity-50">axborot tizimi</h6>
      </div>
    </div>
  );
};
