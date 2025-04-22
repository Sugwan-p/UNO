'use client';

import type { Card, CardColor } from '@/types/uno';

import { useEffect } from 'react';

import { useUnoStore } from '@/stores/useUnoStore';
import CardHand from '@/components/molecules/CardHand';
import ColorPicker from '@/components/organisms/ColorPicker';
import useToast from '@/hooks/useToast';
const GameTable = () => {
  const {
    playerHands,
    currentPlayer,
    discardPile,
    forcedColor,
    winner,
    initializeGame,
    playCard,
    drawCard,
    nextPlayer,
    setForcedColor,
    setWinner,
  } = useUnoStore();

  useEffect(() => {
    if (playerHands.length === 0) {
      initializeGame(2);
    }
  }, [initializeGame, playerHands.length]);

  const currentHand = playerHands[currentPlayer] || [];
  const topCard = discardPile[0];
  const { showToast } = useToast();

  if (!topCard) {
    return <div className="p-8 text-center">🌀 게임 준비 중...</div>;
  }

  const effectiveTopColor = forcedColor ?? topCard.color;

  const isPlayable = (card: Card): boolean =>
    card.color === effectiveTopColor ||
    card.value === topCard.value ||
    card.color === 'wild';

  const handleCardClick = (idx: number) => {
    const card = currentHand[idx];

    if (!isPlayable(card)) {
      showToast({
        title: '실패 입니다',
        description: '이 카드를 버릴 수 없습니다.',
        type: 'danger',
        lazy: true,
      });

      return;
    }

    // 기능 카드 처리
    if (card.value === 'drawTwo') {
      playCard(currentPlayer, idx);
      nextPlayer();
      drawCard((currentPlayer + 1) % playerHands.length);
      drawCard((currentPlayer + 1) % playerHands.length);

      return;
    }

    if (
      card.value === 'skip' ||
      (card.value === 'reverse' && playerHands.length === 2)
    ) {
      playCard(currentPlayer, idx);
      nextPlayer();
      nextPlayer();

      return;
    }

    if (card.value === 'wildDrawFour') {
      playCard(currentPlayer, idx);
      drawCard((currentPlayer + 1) % playerHands.length);
      drawCard((currentPlayer + 1) % playerHands.length);
      drawCard((currentPlayer + 1) % playerHands.length);
      drawCard((currentPlayer + 1) % playerHands.length);

      return;
    }

    if (card.color === 'wild') {
      playCard(currentPlayer, idx);

      return;
    }

    playCard(currentPlayer, idx);
    nextPlayer();
  };

  const handleColorSelect = (color: CardColor) => {
    setForcedColor(color);
    nextPlayer();
  };

  const handleReset = () => {
    initializeGame(2);
    setWinner(null);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 relative">
      <h2 className="text-xl font-bold">현재 플레이어: {currentPlayer + 1}</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-500">버린 카드:</p>
        <CardHand
          cards={[{ ...topCard, color: effectiveTopColor }]}
          onCardClick={() => {}}
        />
      </div>

      <CardHand cards={currentHand} onCardClick={handleCardClick} />

      <button
        className="mt-4 px-4 py-2 bg-main rounded text-white"
        onClick={() => {
          drawCard(currentPlayer);
          nextPlayer();
        }}
      >
        카드 뽑기
      </button>

      {topCard.color === 'wild' && forcedColor === null && (
        <ColorPicker onSelect={handleColorSelect} />
      )}

      {winner !== null && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg">
            <h2 className="text-xl font-bold mb-2">
              🎉 Player {winner + 1} 승리!
            </h2>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleReset}
            >
              게임 다시 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 게임 테이블 컴포넌트
export default GameTable;
