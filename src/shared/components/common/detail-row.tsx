import React, { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  value: ReactNode;
}

const DetailRow: React.FC<InfoCardProps> = ({ title, value }) => {
  if (!value) {
    return null;
  }
  return (
    <div className="grid grid-cols-2 gap-2 py-4 px-2.5 rounded-lg content-center odd:bg-neutral-50">
      <h2 className="font-medium text-gray-700">{title}</h2>
      <p className="font-normal text-gray-900">{value}</p>
    </div>
  );
};

export default DetailRow;
