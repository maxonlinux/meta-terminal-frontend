"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { SubmitButton } from "@/features/auth/components/SubmitButton";
import type { LoginForm as LoginFormValues } from "@/features/auth/types";

export default function LoginForm() {
  const router = useRouter();

  const { handleSubmit, control, formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    const res = await fetch("/proxy/main/api/v1/auth/login", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.refresh();
      return;
    }

    const body = await res.json();

    if (body.error === "USER_NOT_ACTIVE") {
      router.push(`/activate/${data.username}`);
      return;
    }

    toast.error(body.error);
  };

  return (
    <Form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <div className="grid grid-cols-1 w-full gap-4">
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
      </div>
      <div className="flex flex-col items-center gap-4 w-full mt-4">
        <SubmitButton isSubmitting={formState.isSubmitting} label="Login" />
        <div className="w-full text-sm">
          <Link className="text-accent underline" href="/register">
            Register
          </Link>{" "}
          <span className="text-neutral-500">|</span>{" "}
          <Link className="text-accent underline" href="/recovery">
            Forgot password?
          </Link>
        </div>
      </div>
    </Form>
  );
}
