'use client';

import type { Card as CardType } from '@/types/uno';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';

import { useRoomSync } from '@/hooks/useRoomSync';
import { playCard } from '@/utils/firestore/playCardApi';
import { setForcedColor } from '@/utils/firestore/setForcedColorApi';
import { drawCard } from '@/utils/firestore/drawCardApi';
import { nextTurn } from '@/utils/firestore/nextTurnApi';
import { resetRoom } from '@/utils/firestore/resetRoomApi';
import { leaveRoom } from '@/utils/firestore/leaveRoomApi';
import { db } from '@/firebase/config';
import Card from '@/components/atoms/Card';
import ColorPicker from '@/components/organisms/ColorPicker';

const CardBack = () => (
  <div className="w-20 h-28 rounded-xl bg-gray-400 border-2 border-gray-600 shadow-inner" />
);

const DrawCardButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="w-20 h-28 rounded-xl bg-white border-2 border-dashed border-gray-400 shadow-md flex items-center justify-center text-sm font-semibold text-gray-600 hover:bg-gray-100"
    onClick={onClick}
  >
    카드 뽑기
  </button>
);

const RoomView = ({ roomId }: { roomId: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const playerId = searchParams.get('player') ?? 'unknown';
  const room = useRoomSync(roomId);

  const [pendingWildIndex, setPendingWildIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    if (!room) return;
    const winnerId = Object.entries(room.hands).find(
      ([, cards]) => cards.length === 0,
    )?.[0];

    if (winnerId) setWinner(winnerId);
  }, [room]);

  if (!room) return <div>⏳ 방 불러오는 중...</div>;
  if (!room.players.includes(playerId)) return <div>❌ 플레이어 권한 없음</div>;

  const isMyTurn = room.players[room.turnIndex] === playerId;
  const myHand = room.hands[playerId] || [];
  const opponentId = room.players.find((id) => id !== playerId);
  const opponentHand = opponentId ? room.hands[opponentId] || [] : [];
  const discardTop = room.discardPile?.[0] as CardType;
  const effectiveTopColor = room.forcedColor ?? discardTop.color;
  const isHost = playerId === 'player1';

  const isPlayable = (card: CardType) => {
    return (
      card.color === effectiveTopColor ||
      card.value === discardTop.value ||
      card.color === 'wild'
    );
  };

  const handleCardClick = (idx: number) => {
    const selected = myHand[idx];

    if (!isMyTurn) return;

    if (!isPlayable(selected)) {
      alert('❌ 낼 수 없는 카드입니다!');

      return;
    }

    if (selected.color === 'wild') {
      setPendingWildIndex(idx);

      return;
    }

    playCard(roomId, playerId, idx);
  };

  const handleColorSelect = async (color: string) => {
    if (pendingWildIndex === null) return;

    await setForcedColor(roomId, color);
    await playCard(roomId, playerId, pendingWildIndex);
    setPendingWildIndex(null);
  };

  const handleDraw = async () => {
    if (!isMyTurn) return;
    await drawCard(roomId, playerId);
    await nextTurn(roomId);
  };

  const renderTopCard = () => {
    if (!discardTop) return null;
    const resolvedColor =
      discardTop.color === 'wild' && room.forcedColor
        ? (room.forcedColor as CardType['color'])
        : discardTop.color;

    return <Card {...discardTop} color={resolvedColor} />;
  };

  const handleReset = async () => {
    await resetRoom(roomId);
    setWinner(null);
  };

  const handleGoToRoomList = () => {
    router.push('/test');
  };

  const handleLeaveRoom = async () => {
    await leaveRoom(roomId, playerId);
    router.push('/test');
  };

  const handleStartGame = async () => {
    const ref = doc(db, 'rooms', roomId);

    await updateDoc(ref, { started: true });
  };

  if (!room.started) {
    const isRoomReady = room.joined?.length === room.players.length;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-xl font-bold">🕹 게임 대기 중...</h1>
        <p>
          {room.joined?.length ?? 0} / {room.players.length} 명 참여함
        </p>
        {isHost &&
          (isRoomReady ? (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleStartGame}
            >
              ✅ 게임 시작하기
            </button>
          ) : (
            <p className="text-gray-500">
              모든 인원이 입장해야 시작할 수 있어요.
            </p>
          ))}
        <button
          className="text-sm text-gray-400 underline mt-4"
          onClick={handleLeaveRoom}
        >
          🔙 나가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <button
        className="w-[100px] h-[50px] bg-main text-white rounded"
        onClick={handleLeaveRoom}
      >
        게임 종료
      </button>

      <div className="flex gap-2 mb-4">
        {opponentHand.map((_, i) => (
          <CardBack key={i} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-mono_900">
          현재 터널:{' '}
          <span className="font-bold text-mono_900">
            {room.players[room.turnIndex]}
          </span>
        </p>
        {room.forcedColor && (
          <div className="text-xs text-gray-500">
            선택된 색: <span className="font-bold">{room.forcedColor}</span>
          </div>
        )}
        <div className="flex gap-4 items-center">
          {renderTopCard()}
          {isMyTurn && <DrawCardButton onClick={handleDraw} />}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center mt-4">
        {myHand.map((card, idx) => (
          <Card
            key={`${card.color}-${card.value}-${idx}`}
            {...card}
            onClick={() => handleCardClick(idx)}
          />
        ))}
      </div>

      {pendingWildIndex !== null && (
        <ColorPicker onSelect={handleColorSelect} />
      )}

      {winner && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center space-y-4">
            <h2 className="text-xl font-bold">🎉 {winner} 승리!</h2>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleReset}
            >
              다시 시작하기
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded"
              onClick={handleGoToRoomList}
            >
              방 선택하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomView;
