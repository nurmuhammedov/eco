import { cn } from '@/shared/lib/utils';
import { MainCardsListProps } from '../types';
import React, { useCallback, useMemo } from 'react';

export const MainCardsList = React.memo(
  ({
    cards = [],
    selectedCard = null,
    onCardSelect,
    className = '',
    gridLayout = 'default',
    cardSize = 'md',
    isLoading = false,
  }: MainCardsListProps) => {
    // Precompute grid classes based on layout type
    const gridClasses = useMemo(() => {
      const baseClasses = 'grid gap-4 mb-7 3xl:mb-8 mt-4';

      const layoutClasses = {
        default: 'grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3',
        compact: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
        wide: 'grid-cols-1 lg:grid-cols-2',
      };

      return cn(baseClasses, layoutClasses[gridLayout], className);
    }, [gridLayout, className]);

    // Handle empty state
    if (cards.length === 0 && !isLoading) {
      return (
        <div className="p-8 text-center bg-slate-50 rounded-md border border-slate-200">
          <p className="text-slate-500">No cards available</p>
        </div>
      );
    }

    // Handle loading state
    if (isLoading) {
      return (
        <div className={gridClasses}>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white border border-slate-200 p-6 rounded-md animate-pulse">
                <div className="size-12 rounded-md bg-slate-200 mb-4" />
                <div className="h-6 w-3/4 bg-slate-200 mb-2 rounded" />
                <div className="h-4 bg-slate-200 rounded" />
              </div>
            ))}
        </div>
      );
    }

    // Memoized card click handler factory
    const createCardClickHandler = useCallback(
      (cardId: string) => () => {
        // Prevent unnecessary state updates
        if (cardId !== selectedCard) {
          onCardSelect(cardId);
        }
      },
      [selectedCard, onCardSelect],
    );

    // Card size styles
    const getCardSizeClasses = (size: typeof cardSize) => {
      switch (size) {
        case 'sm':
          return 'p-4';
        case 'lg':
          return 'p-8';
        default:
          return 'p-6';
      }
    };

    return (
      <div className={gridClasses} role="tablist">
        {cards.map((card) => {
          const isSelected = selectedCard === card.id;

          // Performance optimization: only calculate these classes when needed
          const cardClasses = cn(
            'relative cursor-pointer transition-all duration-300 rounded-md border',
            'outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
            getCardSizeClasses(cardSize),
            isSelected
              ? `bg-teal text-white shadow-md transform -translate-y-1 border-transparent ${card.color || ''}`
              : 'bg-white text-slate-800 hover:shadow-sm hover:border-teal border-slate-200',
          );

          const IconComponent = card.icon;
          const iconClasses = cn('size-12', isSelected ? 'text-white' : `text-teal ${card.color ? card.color : ''}`);

          return (
            <div
              role="tab"
              tabIndex={0}
              key={card.id}
              data-card-id={card.id}
              className={cardClasses}
              aria-selected={isSelected}
              onClick={createCardClickHandler(card.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  createCardClickHandler(card.id)();
                }
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex mr-4 mb-4">
                  <IconComponent className={iconClasses} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-medium text-xl mb-1">{card.title}</h3>
                  <p className={cn('text-sm', isSelected ? 'text-white' : 'text-slate-500')}>{card.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  },
);

// Component display name for development and debugging
MainCardsList.displayName = 'MainCardsList';
