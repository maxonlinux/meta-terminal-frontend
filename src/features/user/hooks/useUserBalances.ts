import useSWR from "swr";
import type { UserBalance } from "@/features/user/types";

export const useUserBalances = () => {
  const {
    mutate,
    data: userBalances,
    error,
    isLoading,
  } = useSWR<UserBalance[]>("user:balances", async () => {
    try {
      const res = await fetch("/proxy/main/api/v1/user/balances", {
        method: "GET",
        credentials: "include",
      });
      const body = await res.json();
      if (!res.ok) return [];
      return body;
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
