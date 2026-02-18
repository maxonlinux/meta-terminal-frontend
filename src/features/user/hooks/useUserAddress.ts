import useSWR from "swr";
import type { UserAddress } from "@/features/user/types";
import { useOtpActionStore } from "@/stores/useOtpActionStore";

export const useUserAddress = () => {
  const { setOtpAction } = useOtpActionStore();

  const {
    data: userAddress,
    error,
    mutate,
    isLoading,
  } = useSWR<UserAddress | null>(`user:address`, async () => {
    try {
      const res = await fetch("/proxy/main/api/v1/user/settings/address");
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  });

  const revalidate = () => {
    mutate();
  };

  const updateUserAddress = async (data: {
    country?: string;
    city?: string;
    address?: string;
    zip?: string;
  }) => {
    const res = await fetch("/proxy/main/api/v1/user/settings/address", {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (res.status === 428) {
      setOtpAction(() => updateUserAddress(data));
      return null;
    }

    if (!res.ok) return null;
    return await res.json();
  };

  return {
    userAddress,
    updateUserAddress,
    revalidate,
    isLoading,
    error,
  };
};
