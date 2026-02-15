import { create } from "zustand";

interface WsReconnectStatusStore {
  isExceeded: boolean;
  setExceeded: () => void;
  reset: () => void;
}

export const useWsReconnectStatusStore = create<WsReconnectStatusStore>(
  (set) => ({
    isExceeded: false,
    setExceeded: () => set(() => ({ isExceeded: true })),
    reset: () => set({ isExceeded: false }),
  }),
);
