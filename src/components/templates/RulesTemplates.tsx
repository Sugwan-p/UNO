'use client';
import { useState } from 'react';
import { clsx } from 'clsx';

const cardColors = {
  red: 'bg-red-500 text-white',
  yellow: 'bg-yellow-400 text-black',
  green: 'bg-green-500 text-white',
  blue: 'bg-blue-500 text-white',
  wild: 'bg-black text-white',
};

const CardBox = ({
  color,
  value,
}: {
  color: keyof typeof cardColors;
  value: string;
}) => (
  <div
    className={clsx(
      'w-16 h-24 rounded-lg flex items-center justify-center font-bold text-lg shadow-md',
      cardColors[color],
    )}
  >
    {value}
  </div>
);

const RuleSteps = [
  {
    title: '같은 색상 카드는 낼 수 있어요 🎨',
    before: <CardBox color="red" value="5" />,
    after: <CardBox color="red" value="9" />,
    explanation: '같은 색상의 카드(빨강)는 숫자와 무관하게 낼 수 있습니다.',
  },
  {
    title: '같은 숫자 카드도 낼 수 있어요 🔢',
    before: <CardBox color="green" value="3" />,
    after: <CardBox color="yellow" value="3" />,
    explanation: '색상이 달라도 숫자가 같다면 낼 수 있어요.',
  },
  {
    title: '모든 카드를 다 내면 승리 🏆',
    before: <CardBox color="blue" value="1" />,
    after: <div className="text-xl font-bold">🎉 카드 0장!</div>,
    explanation: '자신의 손에 카드가 0장이 되면 게임에서 승리하게 됩니다!',
  },
];

export default function RulePage() {
  const [step, setStep] = useState(0);
  const rule = RuleSteps[step];

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">
        UNO 게임 규칙 시뮬레이션
      </h1>
      <h2 className="text-xl font-semibold text-center text-main_500">
        {rule.title}
      </h2>

      <div className="flex justify-center gap-6 items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-mono_800">기존 카드</div>
          {rule.before}
        </div>
        <span className="text-lg font-bold">→</span>
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-mono_800">낼 수 있는 카드</div>
          {rule.after}
        </div>
      </div>

      <p className="text-center text-mono_800">{rule.explanation}</p>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm text-black"
          onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
        >
          이전
        </button>
        <button
          className="px-4 py-2 rounded bg-main text-white  text-sm"
          onClick={() =>
            setStep((prev) => Math.min(prev + 1, RuleSteps.length - 1))
          }
        >
          다음
        </button>
      </div>
    </div>
  );
}
