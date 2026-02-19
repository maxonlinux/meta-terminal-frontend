import useSWR from "swr";
import {
  getUserAddress,
  updateUserAddress as updateUserAddressRequest,
} from "@/api/user";
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
    return await getUserAddress();
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
    const res = await updateUserAddressRequest(data);
    if (res.res.status === 428) {
      setOtpAction(() => updateUserAddress(data));
      return null;
    }

    if (!res.res.ok) return null;
    return res.body ?? null;
  };

  return {
    userAddress,
    updateUserAddress,
    revalidate,
    isLoading,
    error,
  };
};
