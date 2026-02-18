import useSWR from "swr";
import type {
  DepositRequestInput,
  FundingRequest,
  WithdrawRequestInput,
} from "@/features/user/types";
import { useOtpActionStore } from "@/stores/useOtpActionStore";

export const useUserTransactions = () => {
  const { setOtpAction } = useOtpActionStore();

  const {
    data: transactions,
    error,
    isLoading,
    mutate,
  } = useSWR<FundingRequest[]>("user:transactions", async () => {
    const res = await fetch("/proxy/main/api/v1/user/funding", {
      method: "GET",
      credentials: "include",
    });
    const body = await res.json();
    return body;
  });

  const createWithdrawalTransaction = async (data: WithdrawRequestInput) => {
    const res = await fetch("/proxy/main/api/v1/user/funding/withdraw", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        asset: data.asset,
        amount: String(data.amount),
        destination: data.destination,
      }),
    });

    if (res.status === 428) {
      setOtpAction(() => createWithdrawalTransaction(data));
      return null;
    }

    await mutate();
    return await res.json();
  };

  const createDepositTransaction = async (data: DepositRequestInput) => {
    const res = await fetch("/proxy/main/api/v1/user/funding/deposit", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        walletId: data.walletId,
        amount: String(data.amount),
      }),
    });

    if (res.status === 428) {
      setOtpAction(() => createDepositTransaction(data));
      return null;
    }

    await mutate();
    return await res.json();
  };

  return {
    transactions: transactions ?? [],
    createDepositTransaction,
    createWithdrawalTransaction,
    isLoading,
    error,
  };
};
