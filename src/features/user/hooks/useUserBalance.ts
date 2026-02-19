import useSWR from "swr";
import { getUserBalance } from "@/api/user";
import type { UserBalance } from "@/features/user/types";

export const useUserBalance = (params: { asset: string; enabled: boolean }) => {
  const {
    data: userBalance,
    error,
    isLoading,
    mutate,
  } = useSWR<UserBalance | null>(
    params.enabled && params.asset ? `user:balance:${params.asset}` : null,
    async () => await getUserBalance(params.asset),
  );

  return {
    revalidate: mutate,
    userBalance: userBalance,
    isLoading: params.enabled ? isLoading : false,
    error,
  };
};
