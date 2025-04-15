import React from 'react';
import { ApplicationIcons } from '@/entities/application-create';

// Komponent qabul qiladigan props
interface ApplicationCardProps {
  application: {
    id: number;
    title: string;
    description: string;
    icon: keyof typeof ApplicationIcons;
  };
  onClick?: () => void;
}

const SendSVGIcon = () => (
  <span className="mr-2">
    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
      />
    </svg>
  </span>
);

// Animatsiyali tugma komponenti
const AnimatedButton = () => {
  return (
    <button
      type="button"
      className="group relative w-full h-10 px-4 py-2 border border-teal rounded-md text-teal overflow-hidden bg-transparent flex items-center justify-center text-sm font-medium hover:bg-teal hover:text-white transition-colors duration-300"
    >
      <span className="relative z-10 flex items-center">
        <SendSVGIcon />
        Ариза юбориш
      </span>

      {/* Animatsiya effekti tugma ichida */}
      <span className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-transform ease-out duration-700" />
    </button>
  );
};

function ApplicationCard({ application, onClick }: ApplicationCardProps) {
  return (
    <div
      className="group p-6 relative border border-slate-100 bg-white flex flex-col justify-between rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onClick={onClick}
    >
      {/* Ikonka qismi */}
      <div className="mb-5 flex items-center">
        {/* Ikonka konteyner */}
        <div className="size-12 rounded-full flex items-center justify-center bg-[#E2E8F0] group-hover:bg-teal group-hover:scale-110 transition-all duration-300">
          <div className="size-6 text-teal group-hover:text-white">
            {ApplicationIcons[application.icon]('currentColor')}
          </div>
        </div>

        {/* Dekorativ chiziq */}
        <div className="h-px flex-grow ml-4 bg-[#E2E8F0] group-hover:bg-teal w-[40%] group-hover:w-[60%] opacity-50 group-hover:opacity-100 transition-all duration-300" />
      </div>

      {/* Sarlavha */}
      <h3 className="text-base font-medium text-slate-800 line-clamp-2 min-h-10">{application.title}</h3>

      {/* Tavsif */}
      <p className="text-sm text-gray-500 font-normal mb-6 line-clamp-2">{application.description}</p>

      {/* Alohida tugma komponenti */}
      <AnimatedButton />
    </div>
  );
}

export default React.memo(ApplicationCard);
