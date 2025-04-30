import { Fragment } from 'react';
import { CardForm } from '@/entities/create-application';

export const AppealFormSkeleton = ({ length = 10, fileLength = 8 }: { length?: number; fileLength?: number }) => {
  return (
    <Fragment>
      <CardForm className="mb-2">
        <div className="animate-pulse md:grid md:grid-cols-2 xl:grid-cols-3 3xl:flex 3xl:flex-wrap gap-x-4 gap-y-5 4xl:w-4/5">
          {[...Array(length)].map((_, index) => (
            <div key={index} className="mb-4">
              <div className="h-5 mb-2 w-48 bg-gray-200 rounded" />
              <div className="h-9 bg-gray-200 rounded w-full 3xl:w-sm" />
            </div>
          ))}
          <div className="3xl:w-4/6">
            <div className="h-5 mb-2 w-48 bg-gray-200 rounded" />
            <div className="h-28 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </CardForm>
      <CardForm className="grid grid-cols-2 2xl:grid-cols-3 gap-x-8 gap-y-4">
        {[...Array(fileLength)].map((_, index) => (
          <div key={index} className="pb-4 border-b">
            <div className="flex items-end xl:items-center justify-between gap-2">
              <div className="h-5 bg-gray-200 rounded w-40" />
              <div className="h-9 bg-gray-200 w-80 rounded" />
            </div>
          </div>
        ))}
      </CardForm>
    </Fragment>
  );
};
