import Icon from '@/shared/components/common/icon';

export default () => (
  <div className="w-1/2 flex flex-col items-center justify-center pt-20 pb-8 bg-no-repeat bg-cover bg-[url(@/shared/assets/images/login-hero.png)]">
    <div className="flex flex-col items-center justify-center">
      <h4 className="text-white max-w-lg text-center font-semibold 3xl:font-bold text-xl 3xl:text-2xl mb-8">
        Ўзбекистон Республикаси Вазирлар Маҳкамаси ҳузуридаги Саноат, радиация
        ва&nbsp;ядро хавфсизлиги қўмитаси
      </h4>
      <Icon name="logo" className="size-44 3xl:size-60" />
    </div>
    <div className="max-w-md text-center text-white mt-20">
      <h6 className="text-xl 3xl:text-2xl opacity-50">
        Саноат, радиация ва&nbsp;ядро хавфсизлиги соҳасида
      </h6>
      <p className="text-2xl 3xl:text-3xl font-semibold opacity-100">
        &laquo;Ягона интеграциялашган экотизим&raquo;
      </p>
      <h6 className="text-xl 3xl:text-2xl opacity-50">ахборот тизими</h6>
    </div>
  </div>
);
