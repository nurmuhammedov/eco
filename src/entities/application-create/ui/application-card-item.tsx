import { ApplicationIcons } from '@/entities/application-create';

// interface ApplicationCardItem {}

const Card = ({ card, category, isHovered, onMouseEnter, onMouseLeave }: any) => {
  return (
    <div
      className={`relative group bg-white rounded-xl overflow-hidden transition duration-300 ease-in-out ${
        isHovered ? 'shadow-lg transform -translate-y-1' : 'shadow-sm'
      } ${card.isHighlighted ? 'ring-1 ring-offset-4' : 'border border-slate-100'}`}
      style={
        {
          // ringColor: card.isHighlighted ? category.color : undefined,
          // ringOffsetColor: '#F8FAFC',
        }
      }
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Metka "Yangi" */}
      {card.isNew && (
        <div className="absolute top-3 right-3 z-10">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
            style={{
              backgroundColor: `${category.color}08`,
              color: category.color,
            }}
          >
            Янги
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Ikonka */}
        <div className="mb-5 flex items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}
            style={{
              backgroundColor: isHovered ? category.color : `${category.color}08`,
              color: isHovered ? 'white' : category.color,
            }}
          >
            <div className="size-6">{ApplicationIcons[card.icon](isHovered ? 'white' : category.color)}</div>
          </div>
          <div
            className="h-px flex-grow ml-4 transition-all duration-300"
            style={{
              backgroundColor: isHovered ? category.color : '#E2E8F0',
              width: isHovered ? '60%' : '40%',
              opacity: isHovered ? 1 : 0.5,
            }}
          ></div>
        </div>

        {/* Sarlavha */}
        <h3 className="text-base font-medium text-slate-800 mb-2 line-clamp-2 min-h-[48px]">{card.title}</h3>

        {/* Qisqacha ma'lumot */}
        <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px]">{card.description}</p>

        {/* Tugma */}
        <div
          className={`relative overflow-hidden h-10 rounded-lg transition-all duration-300 ${
            isHovered ? 'mt-2 mb-0' : 'mt-4 mb-2'
          }`}
          style={{
            backgroundColor: isHovered ? category.color : 'transparent',
            border: `1px solid ${isHovered ? 'transparent' : category.color}`,
          }}
        >
          <button
            className="w-full h-full flex items-center justify-center text-sm font-medium transition-all duration-300"
            style={{
              color: isHovered ? 'white' : category.color,
            }}
          >
            <span className="mr-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </span>
            Ариза юбориш
          </button>

          {/* Animatsiyali fon */}
          <div
            className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform ease-out duration-700"
            style={{
              opacity: isHovered ? 1 : 0,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Card;
