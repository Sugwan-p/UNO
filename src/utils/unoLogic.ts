import type { Card, CardColor, CardValue } from '@/types/uno';

const COLORS: CardColor[] = ['red', 'yellow', 'green', 'blue'];
const VALUES: CardValue[] = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'skip',
  'reverse',
  'drawTwo',
];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];

  COLORS.forEach((color) => {
    deck.push({ color, value: '0' });

    VALUES.forEach((value) => {
      deck.push({ color, value });
      deck.push({ color, value });
    });
  });

  for (let i = 0; i < 4; i++) {
    deck.push({ color: 'wild', value: 'wild' });
    deck.push({ color: 'wild', value: 'wildDrawFour' });
  }

  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] =>
  [...deck].sort(() => Math.random() - 0.5);
