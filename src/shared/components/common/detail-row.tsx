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
    <div className="grid grid-cols-2 content-center items-center gap-0.5 rounded-lg px-2 py-1.5 odd:bg-neutral-50">
      {boldTitle ? (
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
      ) : (
        <h2 className="text-sm font-normal text-gray-700">{title}</h2>
      )}
      <div className="text-sm font-normal text-gray-900">{value}</div>
    </div>
  )
}

export default DetailRow
