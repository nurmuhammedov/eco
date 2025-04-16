import React from 'react';
import { FileInput } from 'lucide-react';

interface MainCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
}

interface MainCardsListProps {
  cards: MainCard[];
  selectedCard: string | null;
  onCardSelect: (cardId: string) => void;
  setHoveredCard: (cardId: string | null) => void;
}

export const MainCardsList: React.FC<MainCardsListProps> = ({ cards, selectedCard, onCardSelect, setHoveredCard }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {cards.map((card) => {
        const isSelected = selectedCard === card.id;
        const cardColor = card.color || '#1E3A8A'; // Default navy color

        return (
          <div
            key={card.id}
            className={`relative cursor-pointer transition-all duration-300 p-6 rounded-xl ${
              isSelected
                ? 'bg-blue-700 text-white shadow-md transform -translate-y-1'
                : 'bg-white text-slate-800 hover:shadow-sm'
            } border border-slate-200`}
            onMouseEnter={() => setHoveredCard(`main-${card.id}`)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onCardSelect(card.id)}
            aria-selected={isSelected}
            role="tab"
          >
            <div className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  isSelected ? 'bg-white' : 'bg-opacity-10'
                }`}
                style={{
                  backgroundColor: isSelected ? 'white' : `${cardColor}10`,
                }}
              >
                <div className="w-6 h-6">
                  <FileInput />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">{card.title}</h3>
                <p className={`text-sm ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{card.description}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
