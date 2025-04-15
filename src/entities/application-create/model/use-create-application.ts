import { useMemo, useState } from 'react';

export const useCreateApplication = (categories: any, cards: any) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const getCategoryById = (categoryId: string) => {
    return categories.find((cat: any) => cat.id === categoryId);
  };

  const filteredCards = useMemo(() => {
    return activeCategory ? cards.filter((card: any) => card.category === activeCategory) : cards;
  }, [cards, activeCategory]);

  return {
    hoveredCard,
    setHoveredCard,
    activeCategory,
    setActiveCategory,
    getCategoryById,
    filteredCards,
  };
};
