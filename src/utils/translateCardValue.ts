import type { CardValue } from '@/types/uno';

export const translateCardValue = (value: CardValue): string => {
  const translations: Record<CardValue, string> = {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    skip: '건너뛰기',
    reverse: '순서 반대',
    drawTwo: '2장 뽑기',
    wild: '색 바꾸기',
    wildDrawFour: '4장 + 색 바꾸기',
  };

  return translations[value];
};
