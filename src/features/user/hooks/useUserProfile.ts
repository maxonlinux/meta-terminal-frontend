import useSWR from "swr";
import {
  getUserProfile,
  updateUserProfile as updateUserProfileRequest,
} from "@/api/user";
import type { UserProfile } from "@/features/user/types";

export const useUserProfile = () => {
  const {
    data: userProfile,
    error,
    isLoading,
  } = useSWR<UserProfile | null>(`user:profile`, async () => {
    return await getUserProfile();
  });

  const updateUserProfile = async (data: {
    name?: string;
    surname?: string;
  }) => {
    const res = await updateUserProfileRequest(data);
    return res ?? null;
  };

  return { userProfile, updateUserProfile, isLoading, error };
};
