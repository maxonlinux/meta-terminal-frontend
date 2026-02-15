import { create } from "zustand";

type OtpAction = (() => Promise<unknown>) | null;

export const useOtpActionStore = create<{
  otpAction: OtpAction;
  setOtpAction: (fn: OtpAction) => void;
  clearOtpAction: () => void;
}>((set) => ({
  otpAction: null,
  setOtpAction: (fn) => set({ otpAction: fn }),
  clearOtpAction: () => set({ otpAction: null }),
}));
