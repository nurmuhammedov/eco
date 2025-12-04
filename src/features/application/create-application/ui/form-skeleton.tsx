import { Fragment } from 'react'
import { CardForm } from '@/entities/create-application'

export const AppealFormSkeleton = ({ length = 10, fileLength = 8 }: { length?: number; fileLength?: number }) => {
  return (
    <Fragment>
      <CardForm className="mb-2">
        <div className="3xl:flex 3xl:flex-wrap 4xl:w-4/5 animate-pulse gap-x-4 gap-y-5 md:grid md:grid-cols-2 xl:grid-cols-3">
          {[...Array(length)].map((_, index) => (
            <div key={index} className="mb-4">
              <div className="mb-2 h-5 w-48 rounded bg-gray-200" />
              <div className="3xl:w-sm h-9 w-full rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </CardForm>
      <CardForm className="grid grid-cols-2 gap-x-8 gap-y-4 2xl:grid-cols-3">
        {[...Array(fileLength)].map((_, index) => (
          <div key={index} className="border-b pb-4">
            <div className="flex items-end justify-between gap-2 xl:items-center">
              <div className="h-5 w-40 rounded bg-gray-200" />
              <div className="h-9 w-80 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </CardForm>
    </Fragment>
  )
}
