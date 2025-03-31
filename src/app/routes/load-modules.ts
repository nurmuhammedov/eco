import { AppRoute2 } from '@/app/routes/types.ts';

const routeModules: Record<string, unknown> = import.meta.glob(
  '@/app/routes/**/routes.tsx',
  {
    eager: true,
  },
);

const moduleRoutes: AppRoute2[] = Object.values(routeModules)
  .map((module: any): AppRoute2 => module.default)
  .flat();

export default moduleRoutes;
