import useSWR from "swr";
import { apiFetch, apiJson } from "@/api/http";
import type { KycRequest } from "@/features/user/types";

export function useKyc() {
  const {
    data: kyc,
    error,
    isLoading,
    mutate,
  } = useSWR<KycRequest | null>("user:kyc", async () => {
    try {
      return await apiJson<KycRequest>("/user/kyc");
    } catch {
      return null;
    }
  });

  const submitKyc = async (form: FormData) => {
    const res = await apiFetch("/user/kyc", {
      method: "POST",
      body: form,
    });
    if (!res.ok) return null;
    const body = await res.json();
    mutate(body);
    return body as KycRequest;
  };

  return { kyc, submitKyc, isLoading, error };
}
