import { useOtpActionStore } from "@/stores/useOtpActionStore";

export const useUserPassword = () => {
  const { setOtpAction } = useOtpActionStore();

  const updateUserPassword = async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const res = await fetch("/proxy/main/api/v1/user/settings/password", {
      credentials: "include",
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
