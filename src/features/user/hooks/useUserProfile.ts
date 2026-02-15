import useSWR from "swr";
import { apiFetch, apiJson } from "@/api/http";
import type { UserProfile } from "@/features/user/types";

export const useUserProfile = () => {
  const {
    data: userProfile,
    error,
    isLoading,
  } = useSWR<UserProfile | null>(`user:profile`, async () => {
    try {
      return await apiJson<UserProfile>("/user/profile");
    } catch {
      return null;
    }
  });

  const updateUserProfile = async (data: {
    name?: string;
    surname?: string;
  }) => {
    const res = await apiFetch("/user/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return await res.json();
  };

  return { userProfile, updateUserProfile, isLoading, error };
};
