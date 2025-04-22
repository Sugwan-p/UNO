'use client';

import { useParams } from 'next/navigation';

import RoomView from '@/components/templates/RoomView';

const RoomPage = () => {
  const params = useParams();
  const rawRoomId = params?.roomId as string;
  const decodedRoomId = decodeURIComponent(rawRoomId); // ✅ 여기 중요!

  return (
    <div className="py-9 flex min-h-screen flex-col">
      <RoomView roomId={decodedRoomId} />
    </div>
  );
};

export default RoomPage;
