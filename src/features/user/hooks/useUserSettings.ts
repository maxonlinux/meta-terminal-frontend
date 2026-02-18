import useSWR from "swr";
import type { UserSettings } from "@/features/user/types";

export const useUserSettings = () => {
  const {
    data: userSettings,
    error,
    isLoading,
    mutate,
  } = useSWR<UserSettings | null>("user:settings", async () => {
    try {
      const res = await fetch("/proxy/main/api/v1/user/settings", {
        credentials: "include",
        method: "GET",
      });
      const body = await res.json();
      if (!res.ok) return null;
      return body;
    } catch {
      return null;
    }
  });

  const updateUserSettings = async (
    data: Partial<Omit<UserSettings, "id" | "userId">>,
  ) => {
    const res = await fetch("/proxy/main/api/v1/user/settings", {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) return null;

    mutate();

    const body = await res.json();
    return body;
  };

  return { userSettings, updateUserSettings, isLoading, error };
};
