'use client';

import type { Card as CardType } from '@/types/uno';

import Card from '@/components/atoms/Card';

interface CardHandProps {
  cards?: (CardType | undefined | null)[];
  onCardClick: (cardIndex: number) => void;
}

const CardHand = ({ cards = [], onCardClick }: CardHandProps) => (
  <div className="flex gap-2">
    {cards
      .map((card, idx) => ({ card, idx }))
      .filter(({ card }) => !!card)
      .map(({ card, idx }) => (
        <Card
          key={`${card!.color}-${card!.value}-${idx}`}
          {...card!}
          onClick={() => onCardClick(idx)}
        />
      ))}
  </div>
);

export default CardHand;
