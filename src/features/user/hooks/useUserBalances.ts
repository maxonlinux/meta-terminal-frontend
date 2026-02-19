import useSWR from "swr";
import { getUserBalances } from "@/api/user";
import type { UserBalance } from "@/features/user/types";

export const useUserBalances = () => {
  const {
    mutate,
    data: userBalances,
    error,
    isLoading,
  } = useSWR<UserBalance[]>("user:balances", async () => {
    return await getUserBalances();
  });

  return {
    revalidate: mutate,
    userBalances: Array.isArray(userBalances) ? userBalances : [],
    isLoading,
    error,
  };
};
