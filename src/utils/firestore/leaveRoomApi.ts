import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';

export const leaveRoom = async (
  roomId: string,
  playerId: string,
): Promise<void> => {
  const ref = doc(db, 'rooms', roomId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const joined: string[] = data.joined || [];

  // 플레이어 목록에서 제거
  const updatedJoined = joined.filter((id) => id !== playerId);

  // 아무도 안 남았으면 방 삭제
  if (updatedJoined.length === 0) {
    await deleteDoc(ref);
    console.log(`🗑️ 방 ${roomId} → 모든 플레이어 나감 → 방 삭제됨`);

    return;
  }

  // 남아 있으면 업데이트만
  await updateDoc(ref, { joined: updatedJoined });
  console.log(`🚪 ${playerId} 나감 → ${roomId}`);
};
