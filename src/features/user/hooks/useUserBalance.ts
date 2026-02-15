import useSWR from "swr";
import { apiJson } from "@/api/http";
import type { UserBalance } from "@/features/user/types";

export const useUserBalance = (params: {
  currency: string;
  enabled: boolean;
}) => {
  const {
    data: userBalance,
    error,
    isLoading,
    mutate,
  } = useSWR<UserBalance | null>(
    params.enabled && params.currency
      ? `user:balance:${params.currency}`
      : null,
    async () => {
      try {
        const body = await apiJson<UserBalance | UserBalance[]>(
          "/user/balance",
          {
            query: { currency: params.currency },
          },
        );
        if (Array.isArray(body)) return null;
        return body;
      } catch {
        return null;
      }
    },
  );

  return {
    revalidate: mutate,
    userBalance: userBalance,
    isLoading: params.enabled ? isLoading : false,
    error,
  };
};
