import type { Card } from '@/types/uno';

const COLORS = ['red', 'yellow', 'green', 'blue'] as const;
const VALUES = [
  '0',
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
  'wild',
  'wildDrawFour',
] as const;

export const createDeck = (): Card[] => [
  ...COLORS.flatMap((color) => [
    { color, value: '0' as const },
    ...VALUES.filter(
      (v) => v !== '0' && v !== 'wild' && v !== 'wildDrawFour',
    ).flatMap((value) => [
      { color, value },
      { color, value },
    ]),
  ]),
  ...Array.from({ length: 4 }, () => ({
    color: 'wild' as const,
    value: 'wild' as const,
  })),
  ...Array.from({ length: 4 }, () => ({
    color: 'wild' as const,
    value: 'wildDrawFour' as const,
  })),
];

export const shuffleDeck = (deck: Card[]): Card[] => {
  const copy = [...deck];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
};
