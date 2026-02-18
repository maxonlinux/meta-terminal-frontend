import useSWR from "swr";
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
        const res = await fetch(
          `/proxy/main/api/v1/user/balance?currency=${params.currency}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const body = await res.json();
        if (!res.ok) return null;
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
