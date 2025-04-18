import React, { memo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GoBackProps {
  title: string;
  fallbackPath?: string;
}

const GoBack: React.FC<GoBackProps> = memo(({ title, fallbackPath = '/' }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.state && window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button aria-label="back" onClick={handleGoBack} className="flex items-center">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <h1 className="text-xl font-semibold truncate text-neutral-850">{title}</h1>
    </div>
  );
});

export default GoBack;
