import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { CustomCountrySelect } from "@/components/ui/CustomCountrySelect";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { useUserAddress } from "@/features/user/hooks/useUserAddress";
import type { UserAddress } from "@/features/user/types";
import { SubmitButton } from "../SubmitButton";

export function AddressForm({ userAddress }: { userAddress: UserAddress }) {
  const { updateUserAddress } = useUserAddress();

  const { handleSubmit, control, formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      country: userAddress.country ?? "",
      city: userAddress.city ?? "",
      address: userAddress.address ?? "",
      zip: userAddress.zip ?? "",
    },
  });

  return (
    <Form
      onSubmit={(e) => handleSubmit(updateUserAddress)(e)}
      className="flex flex-col gap-4 p-4"
    >
      <p className="text-sm">Address</p>
      <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <CustomCountrySelect
              {...field}
              locale="en"
              placeholder="United States of America"
              label="Country"
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{ placeholder: "New York" }}
              label="City"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{ placeholder: "123 Main St" }}
              label="Address"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="zip"
          control={control}
          rules={{
            pattern: {
              value: /^[A-Za-z0-9][A-Za-z0-9\s-]{2,14}$/,
              message: "INVALID_ZIP_CODE",
            },
          }}
          render={({ field, fieldState }) => (
            <CustomTextField
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{
                placeholder: "12345",
              }}
              label="Zip code"
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div>
        <SubmitButton
          isSubmitting={formState.isSubmitting}
          isDirty={formState.isDirty}
          label="Save address"
        />
      </div>
    </Form>
  );
}
