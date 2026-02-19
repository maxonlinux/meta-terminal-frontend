import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { useUserProfile } from "@/features/user/hooks/useUserProfile";
import type { UserProfile } from "@/features/user/types";
import { SubmitButton } from "../settings/SubmitButton";

export function ProfileForm({ userProfile }: { userProfile: UserProfile }) {
  const { updateUserProfile } = useUserProfile();

  const { handleSubmit, control, formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: userProfile.email,
      username: userProfile.username,
      phone: userProfile.phone,
      name: userProfile.name ?? "",
      surname: userProfile.surname ?? "",
    },
  });

  return (
    <Form
      onSubmit={(e) => void handleSubmit(updateUserProfile)(e)}
      className="flex flex-col gap-4 p-4"
    >
      <p className="text-sm">Basic data</p>
      <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{ placeholder: "John" }}
              label="Name"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="surname"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{ placeholder: "Smith" }}
              label="Surname"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isDisabled: true,
                isInvalid: fieldState.invalid,
                className: "disabled:opacity-30",
              }}
              inputProps={{
                placeholder: "example@email.com",
              }}
              label="Email"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isDisabled: true,
                isInvalid: fieldState.invalid,
                className: "disabled:opacity-30",
              }}
              inputProps={{ placeholder: "+12345678910" }}
              label="Phone"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isDisabled: true,
                isInvalid: fieldState.invalid,
                className: "disabled:opacity-30",
              }}
              inputProps={{ placeholder: "user_name" }}
              label="Username"
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div>
        <SubmitButton
          isSubmitting={formState.isSubmitting}
          isDirty={formState.isDirty}
          label="Save settings"
        />
      </div>
    </Form>
  );
}
