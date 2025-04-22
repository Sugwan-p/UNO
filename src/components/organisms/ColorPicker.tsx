'use client';

import type { CardColor } from '@/types/uno';

const COLOR_LIST: CardColor[] = ['red', 'yellow', 'green', 'blue'];

const ColorPicker = ({
  onSelect,
}: {
  onSelect: (color: CardColor) => void;
}) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg flex gap-4">
      {COLOR_LIST.map((color) => (
        <button
          key={color}
          className={`w-16 h-16 rounded-full ${getColorClass(color)}`}
          onClick={() => onSelect(color)}
        />
      ))}
    </div>
  </div>
);

const getColorClass = (color: CardColor) =>
  ({
    red: 'bg-red-500',
    yellow: 'bg-yellow-400',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    wild: '',
  })[color];

export default ColorPicker;
