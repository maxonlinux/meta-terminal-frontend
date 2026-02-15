import type { Wallet } from "@/features/user/types";

// NOTE: This file exists only to keep some UI flows unblocked while the
// corresponding backend endpoints are being built out.

export const userData = {
  plan: 0,
  isWithdrawalBlocked: false,
  withdrawalBlockedMessage: "Withdrawals are temporarily disabled",
};

export const userWallets: Wallet[] = [
  {
    id: 1,
    name: "Mock TRC-20",
    network: "TRC-20",
    address: "TQk4n2g8yJ8jzQyKs7dX1jYQ1i9Z9qZ1z",
    currency: "USDT",
  },
  {
    id: 2,
    name: "Mock ERC-20",
    network: "ERC-20",
    address: "0x6bF7dF2e5f0d9A1fF5b1e9B9f0e7f0f9f5b1e9B",
    currency: "USDC",
  },
];
