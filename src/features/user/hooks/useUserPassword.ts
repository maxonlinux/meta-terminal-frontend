import { apiFetch } from "@/api/http";
import { useOtpActionStore } from "@/stores/useOtpActionStore";

export const useUserPassword = () => {
  const { setOtpAction } = useOtpActionStore();

  const updateUserPassword = async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const res = await apiFetch("/user/settings/password", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (res.status === 428) {
      setOtpAction(() => updateUserPassword(data));
      return null;
    }

    return await res.json();
  };

  return { updateUserPassword };
};
