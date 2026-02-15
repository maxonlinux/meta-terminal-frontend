import useSWR from "swr";
import { apiFetch, apiJson } from "@/api/http";
import type { UserSettings } from "@/features/user/types";

export const useUserSettings = () => {
  const {
    data: userSettings,
    error,
    isLoading,
    mutate,
  } = useSWR<UserSettings | null>("user:settings", async () => {
    try {
      return await apiJson<UserSettings>("/user/settings");
    } catch {
      return null;
    }
  });

  const updateUserSettings = async (
    data: Partial<Omit<UserSettings, "id" | "userId">>,
  ) => {
    const res = await apiFetch("/user/settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;

    mutate();

    const body = await res.json();
    return body;
  };

  return { userSettings, updateUserSettings, isLoading, error };
};
