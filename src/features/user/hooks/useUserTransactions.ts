import useSWR from "swr";
import { apiFetch, apiJson } from "@/api/http";
import type {
  FundingRequest,
  FundingRequestInput,
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
    return await apiJson<FundingRequest[]>("/user/funding");
  });

  const createWithdrawalTransaction = async (data: FundingRequestInput) => {
    const res = await apiFetch("/user/funding/withdraw", {
      method: "POST",
      body: JSON.stringify({
        asset: data.asset,
        amount: data.amount.toString(),
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

  const createDepositTransaction = async (data: FundingRequestInput) => {
    const res = await apiFetch("/user/funding/deposit", {
      method: "POST",
      body: JSON.stringify({
        walletId: data.walletId,
        amount: data.amount.toString(),
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
