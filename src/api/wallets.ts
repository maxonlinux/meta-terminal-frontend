import { requestJson } from "@/api/http";
import type { Wallet } from "@/features/user/types";

export const fetchWallets = async (): Promise<Wallet[]> => {
  const { res, body } = await requestJson<Wallet[]>(
    "/proxy/main/api/v1/user/wallets",
    {
      credentials: "include",
      method: "GET",
    },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
};
