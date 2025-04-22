import type { Card as CardType } from '@/types/uno';

import { translateCardValue } from '@/utils/translateCardValue';

interface CardProps extends CardType {
  onClick?: () => void;
}

const COLOR_STYLE_MAP: Record<CardType['color'], { bg: string; text: string }> =
  {
    red: { bg: 'bg-red-500', text: 'text-black' },
    yellow: { bg: 'bg-yellow-300', text: 'text-black' },
    green: { bg: 'bg-green-500', text: 'text-black' },
    blue: { bg: 'bg-blue-500', text: 'text-black' },
    wild: {
      bg: 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600',
      text: 'text-white',
    },
  };

const Card = ({ color, value, onClick }: CardProps) => {
  const style = COLOR_STYLE_MAP[color];

  return (
    <div
      className={`w-20 h-28 rounded-xl shadow-lg flex items-center justify-center text-sm text-center font-bold px-2 cursor-pointer transition-transform hover:scale-105 ${style.bg} ${style.text}`}
      onClick={onClick}
    >
      {translateCardValue(value)}
    </div>
  );
};

export default Card;
