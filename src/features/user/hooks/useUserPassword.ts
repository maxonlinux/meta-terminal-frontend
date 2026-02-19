import { updateUserPassword as updateUserPasswordRequest } from "@/api/user";
import { useOtpActionStore } from "@/stores/useOtpActionStore";

export const useUserPassword = () => {
  const { setOtpAction } = useOtpActionStore();

  const updateUserPassword = async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const res = await updateUserPasswordRequest(data);

    if (res.res.status === 428) {
      setOtpAction(() => updateUserPassword(data));
      return null;
    }

    return res.body ?? null;
  };

  return { updateUserPassword };
};
