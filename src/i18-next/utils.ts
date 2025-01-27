import { Language } from '@/shared/types/language';

const languages: Language[] = [
  Language.KR,
  Language.UZ,
  Language.RU,
  Language.EN,
];
export const namespaces: string[] = ['common', 'auth'];

export const loadResources = async () => {
  const resources: Record<string, any> = {};

  await Promise.all(
    languages.map(async (lng) => {
      resources[lng] = {};
      await Promise.all(
        namespaces.map(async (ns) => {
          try {
            const module = await import(
              `@/i18-next/translations/${lng}/${ns}.json`
            );
            resources[lng][ns] = module.default;
          } catch (error) {
            console.error(`Error loading ${lng}/${ns}:`, error);
          }
        }),
      );
    }),
  );

  return resources;
};
