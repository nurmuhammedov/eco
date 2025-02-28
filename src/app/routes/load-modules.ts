import { AppRoute } from '@/app/routes';

const routeModules: Record<string, unknown> = import.meta.glob(
  '@/app/routes/**/routes.tsx',
  {
    eager: true,
  },
);

const moduleRoutes: AppRoute[] = Object.values(routeModules)
  .map((module: any): AppRoute => module.default)
  .flat();

export default moduleRoutes;
