import useSWR from "swr";
import { getUserKyc, submitUserKyc } from "@/api/user";
import type { KycRequest } from "@/features/user/types";

export function useKyc() {
  const {
    data: kyc,
    error,
    isLoading,
    mutate,
  } = useSWR<KycRequest | null>("user:kyc", async () => {
    return await getUserKyc();
  });

  const submitKyc = async (form: FormData) => {
    const res = await submitUserKyc(form);
    if (!res.res.ok) return null;
    mutate(res.body ?? null);
  };

  return { kyc, submitKyc, isLoading, error };
}
