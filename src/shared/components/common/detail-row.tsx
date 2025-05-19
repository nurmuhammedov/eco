import React from 'react';

interface InfoCardProps {
  title: string;
  value: string | number;
}

const DetailRow: React.FC<InfoCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">{title}</h2>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default DetailRow;
