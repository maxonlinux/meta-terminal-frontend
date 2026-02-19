import useSWR from "swr";
import {
  createDepositTransaction as createDepositRequest,
  createWithdrawalTransaction as createWithdrawalRequest,
  getUserTransactions,
} from "@/api/user";
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
    return await getUserTransactions();
  });

  const createWithdrawalTransaction = async (data: WithdrawRequestInput) => {
    const res = await createWithdrawalRequest(data);

    if (res.res.status === 428) {
      setOtpAction(() => createWithdrawalTransaction(data));
      return null;
    }

    if (!res.res.ok) return null;
    await mutate();
    return res.body ?? null;
  };

  const createDepositTransaction = async (data: DepositRequestInput) => {
    const res = await createDepositRequest(data);

    if (res.res.status === 428) {
      setOtpAction(() => createDepositTransaction(data));
      return null;
    }

    if (!res.res.ok) return null;
    await mutate();
    return res.body ?? null;
  };

  return {
    transactions: Array.isArray(transactions) ? transactions : [],
    createDepositTransaction,
    createWithdrawalTransaction,
    isLoading,
    error,
  };
};
