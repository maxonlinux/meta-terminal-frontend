import useSWR from "swr";
import type { UserProfile } from "@/features/user/types";

export const useUserProfile = () => {
  const {
    data: userProfile,
    error,
    isLoading,
  } = useSWR<UserProfile | null>(`user:profile`, async () => {
    try {
      const res = await fetch("/proxy/main/api/v1/user/profile", {
        credentials: "include",
        method: "GET",
      });
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  });

  const updateUserProfile = async (data: {
    name?: string;
    surname?: string;
  }) => {
    const res = await fetch("/proxy/main/api/v1/user/profile", {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return await res.json();
  };

  return { userProfile, updateUserProfile, isLoading, error };
};
