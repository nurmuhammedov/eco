import Icon from '@/shared/components/common/icon'

export const LoginInfoSection = () => {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center bg-[url(@/shared/assets/images/login-hero.png)] bg-cover bg-no-repeat pt-20 pb-8">
      <div className="flex flex-col items-center justify-center">
        <h4 className="3xl:font-bold 3xl:text-2xl mb-8 max-w-lg px-4 text-center text-xl font-semibold text-white">
          O‘zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi sanoat, radiatsiya va yadro xavfsizligi qo‘mitasi
        </h4>
        <Icon name="logo" className="3xl:size-60 size-44" />
      </div>
      <div className="mt-20 max-w-full px-4 text-center text-white">
        <h6 className="3xl:text-2xl text-xl opacity-50">Sanoat, radiatsiya va yadro xavfsizligi sohasida</h6>
        <p className="3xl:text-3xl text-2xl font-semibold opacity-100">
          &laquo;Yagona integratsiyalashgan ekotizim&raquo;
        </p>
        <h6 className="3xl:text-2xl text-xl opacity-50">axborot tizimi</h6>
      </div>
    </div>
  )
}
