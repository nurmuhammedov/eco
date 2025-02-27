import { CardForm } from './application-form-card.tsx';
import { Skeleton } from '@/shared/components/ui/skeleton.tsx';

export const SkeletonFormLoader = () => {
  return (
    <CardForm className="my-2">
      <div className="md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-6 4xl:w-5/5 mb-5">
        {Array.from({ length: 20 }).map((_, index) => (
          <div className="space-y-2" key={index}>
            <Skeleton className="h-3 3xl:h-4 w-1/2" />
            <Skeleton className="h-6 3xl:h-7 w-full 3xl:w-sm" />
          </div>
        ))}
      </div>
    </CardForm>
  );
};
