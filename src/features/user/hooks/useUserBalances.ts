import useSWR from "swr";
import { apiJson } from "@/api/http";
import type { UserBalance } from "@/features/user/types";

export const useUserBalances = () => {
  const {
    mutate,
    data: userBalances,
    error,
    isLoading,
  } = useSWR<UserBalance[]>("user:balances", async () => {
    try {
      return await apiJson<UserBalance[]>("/user/balances");
    } catch {
      return [];
    }
  });

  return {
    revalidate: mutate,
    userBalances: userBalances ?? [],
    isLoading,
    error,
  };
};
