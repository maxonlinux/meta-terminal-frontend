"use client";

import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateUserPassword } from "@/api/user";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { useOtpActionStore } from "@/stores/useOtpActionStore";
import { SubmitButton } from "../SubmitButton";

export function ChangePasswordForm() {
  const { setOtpAction } = useOtpActionStore();

  const { handleSubmit, control, formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const res = await updateUserPassword(data);
    if (res.res.status === 428) {
      setOtpAction(() => onSubmit(data));
      return null;
    }

    if (!res.res.ok) {
      toast.error("ERROR OCCURRED");
      return null;
    }

    toast.success("Success");
  };

  return (
    <Form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="flex flex-col gap-4 p-4"
    >
      <p className="text-sm">Change password</p>
      <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
        <Controller
          name="oldPassword"
          control={control}
          rules={{
            required: "Old password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{
                placeholder: "********",
                autoComplete: "off",
                required: true,
              }}
              label="Old password"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="newPassword"
          control={control}
          rules={{
            required: "New password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{
                placeholder: "********",
                autoComplete: "off",
                required: true,
              }}
              label="New password"
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div>
        <SubmitButton
          isSubmitting={formState.isSubmitting}
          isDirty={formState.isDirty}
          label="Change password"
        />
      </div>
    </Form>
  );
}
