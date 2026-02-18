import useSWR from "swr";
import type { KycRequest } from "@/features/user/types";

export function useKyc() {
  const {
    data: kyc,
    error,
    isLoading,
    mutate,
  } = useSWR<KycRequest | null>("user:kyc", async () => {
    try {
      const res = await fetch("/proxy/main/api/v1/user/kyc", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) return null;
      const body = await res.json();
      return body;
    } catch {
      return null;
    }
  });

  const submitKyc = async (form: FormData) => {
    const res = await fetch("/proxy/main/api/v1/user/kyc", {
      method: "POST",
      credentials: "include",
      body: form,
    });
    if (!res.ok) return null;
    const body = await res.json();
    mutate(body);
  };

  return { kyc, submitKyc, isLoading, error };
}
