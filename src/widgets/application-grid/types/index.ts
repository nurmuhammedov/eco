import { LucideIcon } from 'lucide-react';
import { ElementType } from 'react';

export interface MainCard {
  id: string;
  title: string;
  color?: string;
  icon: LucideIcon | ElementType;
  description: string;
}

export interface MainCardsListProps {
  cards: MainCard[];
  selectedCard: string | null;
  onCardSelect: (cardId: string) => void;
  className?: string;
  gridLayout?: 'default' | 'compact' | 'wide';
  cardSize?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  testId?: string;
}
