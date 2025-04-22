import { doc, updateDoc } from 'firebase/firestore';

import { db } from '@/firebase/config';

export const setForcedColor = async (roomId: string, color: string) => {
  const ref = doc(db, 'rooms', roomId);

  await updateDoc(ref, { forcedColor: color });
};
