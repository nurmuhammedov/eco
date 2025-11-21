import React, { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  boldTitle?: boolean;
  value: ReactNode;
}

const DetailRow: React.FC<InfoCardProps> = ({ title, value, boldTitle = false }) => {
  if (!value) {
    return null;
  }
  return (
    <div className="grid grid-cols-2 gap-1 py-2 px-2.5 rounded-lg content-center odd:bg-neutral-50 items-center">
      {boldTitle ? (
        <h2 className="font-medium text-base text-gray-700">{title}</h2>
      ) : (
        <h2 className="font-normal text-normal text-gray-700">{title}</h2>
      )}
      <p className="font-normal text-normal text-gray-900">{value}</p>
    </div>
  );
};

export default DetailRow;
