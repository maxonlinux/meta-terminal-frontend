"use client";

import {
  type CountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form } from "react-aria-components";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { CustomPhoneField } from "@/components/ui/CustomPhoneField";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { SubmitButton } from "@/features/auth/components/SubmitButton";
import type { RegisterForm } from "@/features/auth/types";

export default function RegisterFormComponent({
  callingCode,
}: {
  callingCode: CountryCallingCode;
}) {
  const router = useRouter();
  const cleanCallingCode = parseInt(callingCode, 10).toString();

  const { handleSubmit, control, formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      phone: `+${cleanCallingCode}`,
    },
  });

  const password = useWatch({ control, name: "password" });

  const onSubmit = async (data: RegisterForm) => {
    const res = await fetch("/proxy/main/api/v1/auth/register", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Registration success");
      router.push(`/activate/${data.username}`);
      return;
    }

    const body = await res.json();
    toast.error(body.error);
  };

  return (
    <Form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <div className="grid grid-cols-1 w-full gap-4">
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            validate: (value) => {
              const regex =
                /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
              return regex.test(value) || "Invalid email";
            },
          }}
          render={({ field, fieldState }) => (
            <CustomTextField
              label="Email"
              isVisualRequired
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{
                autoComplete: "email",
                placeholder: "address@example.com",
              }}
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          rules={{
            required: "Phone number is required",
            validate: (value) => {
              if (!value) return;

              if (!value.startsWith("+")) {
                return "PHONE_NOT_INTERNATIONAL_FORMAT";
              }

              const parsed = parsePhoneNumberFromString(value);
              if (!parsed) return "Invalid phone number";

              return parsed.isValid() || "Invalid phone number";
            },
          }}
          render={({ field, fieldState }) => (
            <CustomPhoneField
              {...field}
              label="Phone"
              isVisualRequired
              isInvalid={fieldState.invalid}
              autoComplete="phone"
              placeholder="+7 234 213 19"
              className="w-full"
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          rules={{ required: "Username is required" }}
          render={({ field, fieldState }) => (
            <CustomTextField
              label="Username"
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{
                autoComplete: "username",
                placeholder: "Username",
              }}
              isVisualRequired
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
          render={({ field, fieldState }) => (
            <CustomTextField
              label="Password"
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{
                type: "password",
                autoComplete: "new-password",
                placeholder: "********",
              }}
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Confirm password",
            validate: (value: string) =>
              value === password || "Passwords do not match",
          }}
          render={({ field, fieldState }) => (
            <CustomTextField
              label="Confirm Password"
              textFieldProps={{
                ...field,
                isInvalid: fieldState.invalid,
              }}
              inputProps={{
                type: "password",
                autoComplete: "new-password",
                placeholder: "********",
              }}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>
      <div className="flex flex-col items-center gap-4 w-full mt-4">
        <SubmitButton isSubmitting={formState.isSubmitting} label="Register" />
        <div className="w-full text-neutral-500 text-sm">
          Already have an account?{" "}
          <Link className="text-accent underline" href="/login">
            Log In
          </Link>
        </div>
      </div>
    </Form>
  );
}
