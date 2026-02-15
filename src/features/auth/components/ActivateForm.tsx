"use client";

import { Loader } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { Button, Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import { useCountdown } from "usehooks-ts";
import { ApiError, apiFetch } from "@/api/http";
import { CustomOtpField } from "@/components/ui/CustomOtpFIeld";
import { SubmitButton } from "@/features/auth/components/SubmitButton";
import type { ActivateForm as ActivateFormValues } from "@/features/auth/types";

export function ActivateForm({ username }: { username: string }) {
  const router = useRouter();

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  const { error, isValidating, mutate } = useSWR(
    `otp:generate`,
    async () => {
      const res = await apiFetch("/otp/generate", {
        method: "POST",
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const body = await res.json();
        toast.error(body.error);
        return;
      }

      toast.success("OTP requested");

      resetCountdown();
      startCountdown();
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: false,
    },
  );

  const { handleSubmit, control, formState } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      username: username,
      otp: "",
    },
  });

  const onSubmit = async (data: ActivateFormValues) => {
    const res = await apiFetch("/otp/validate", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json();
      toast.error(body.error);
      return;
    }

    toast.success("Successfully signed in");
    router.push("/login");
  };

  const resendOtp = async () => {
    await mutate();
  };

  if (error instanceof ApiError && error.status === 404) {
    return redirect("/register");
  }

  return (
    <Form onSubmit={(e) => void handleSubmit(onSubmit)(e)} autoComplete="off">
      <div className="grid grid-cols-1 w-full gap-4">
        <Controller
          name="otp"
          control={control}
          rules={{
            required: "Code is required",
            minLength: {
              value: 6,
              message: "Code must be 6 characters",
            },
            maxLength: {
              value: 6,
              message: "Code must be 6 characters",
            },
          }}
          render={({ field, fieldState }) => (
            <CustomOtpField
              label="OTP Code"
              {...field}
              isVisualRequired
              isInvalid={fieldState.invalid}
              placeholder="XXX-XXX"
              className="w-full"
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>
      <div className="flex flex-col items-center gap-4 w-full mt-4">
        <SubmitButton isSubmitting={formState.isSubmitting} label="Confirm" />
      </div>
      <div className="flex justify-end mt-2">
        {count > 0 ? (
          <span className="text-sm opacity-50">Get code in {count} sec</span>
        ) : (
          <Button
            type="button"
            onPress={() => resendOtp()}
            isDisabled={isValidating}
            className="flex items-center gap-2 text-sm text-blue-500 hover:underline cursor-pointer disabled:text-neutral-400 disabled:pointer-events-none"
          >
            {isValidating && (
              <Loader size={14} className="inline animate-spin" />
            )}
            Get OTP code
          </Button>
        )}
      </div>
    </Form>
  );
}
