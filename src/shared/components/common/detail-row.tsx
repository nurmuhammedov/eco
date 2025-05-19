import React from 'react';

interface InfoCardProps {
  title: string;
  value: string | number;
}

const DetailRow: React.FC<InfoCardProps> = ({ title, value }) => {
  return (
    <div className="grid grid-cols-2 gap-2 py-3 border-b border-[#DDE2F1]">
      <h2 className="font-normal text-gray-700 mb-2">{title}</h2>
      <p className="font-normal text-gray-900">{value}</p>
    </div>
  );
};

export default DetailRow;
