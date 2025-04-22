const COLORS = ['red', 'yellow', 'green', 'blue'] as const;

interface Props {
  onSelect: (color: string) => void;
}

const ColorPicker = ({ onSelect }: Props) => (
  <div className="flex gap-4 mt-4">
    {COLORS.map((color) => (
      <button
        key={color}
        aria-label={`색상 선택: ${color}`}
        className={`w-10 h-10 rounded-full shadow-md border-2 border-white ${colorToClass(
          color,
        )}`}
        onClick={() => onSelect(color)}
      />
    ))}
  </div>
);

const colorToClass = (color: string) => {
  switch (color) {
    case 'red':
      return 'bg-red-500';
    case 'yellow':
      return 'bg-yellow-300';
    case 'green':
      return 'bg-green-500';
    case 'blue':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

export default ColorPicker;
