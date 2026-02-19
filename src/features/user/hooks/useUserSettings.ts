import useSWR from "swr";
import {
  getUserSettings,
  updateUserSettings as updateUserSettingsRequest,
} from "@/api/user";
import type { UserSettings } from "@/features/user/types";
import { useOtpActionStore } from "@/stores/useOtpActionStore";

export const useUserSettings = () => {
  const { setOtpAction } = useOtpActionStore();
  const {
    data: userSettings,
    error,
    isLoading,
    mutate,
  } = useSWR<UserSettings | null>("user:settings", async () => {
    return await getUserSettings();
  });

  const updateUserSettings = async (
    data: Partial<Omit<UserSettings, "id" | "userId">>,
  ) => {
    const res = await updateUserSettingsRequest(data);

    if (res.res.status === 428) {
      setOtpAction(() => updateUserSettings(data));
      return null;
    }

    if (!res.res.ok) return null;

    mutate();

    return res.body ?? null;
  };

  return { userSettings, updateUserSettings, isLoading, error };
};
