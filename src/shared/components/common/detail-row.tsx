import React, { ReactNode } from 'react'

interface InfoCardProps {
  title: string
  boldTitle?: boolean
  value: ReactNode
}

const DetailRow: React.FC<InfoCardProps> = ({ title, value, boldTitle = false }) => {
  if (!value) {
    return null
  }
  return (
    <div className="grid grid-cols-2 content-center items-center gap-1 rounded-lg px-2.5 py-2 odd:bg-neutral-50">
      {boldTitle ? (
        <h2 className="text-base font-medium text-gray-700">{title}</h2>
      ) : (
        <h2 className="text-normal font-normal text-gray-700">{title}</h2>
      )}
      <p className="text-normal font-normal text-gray-900">{value}</p>
    </div>
  )
}

export default DetailRow
