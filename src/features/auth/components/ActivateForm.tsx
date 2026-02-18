"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Button, Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import { useCountdown } from "usehooks-ts";
import { CustomOtpField } from "@/components/ui/CustomOtpFIeld";
import { SubmitButton } from "@/features/auth/components/SubmitButton";
import type { ActivateForm as ActivateFormValues } from "@/features/auth/types";

const OTP_COOLDOWN_SECONDS = 60;

export function ActivateForm({ username }: { username: string }) {
  const router = useRouter();

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: OTP_COOLDOWN_SECONDS,
    countStop: 0,
    intervalMs: 1000,
    isIncrement: false,
  });

  const startTimer = useCallback(() => {
    resetCountdown();
    startCountdown();
  }, [resetCountdown, startCountdown]);

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  const { error, isValidating, mutate } = useSWR(
    `otp:generate:${username}`,
    async () => {
      const res = await fetch("/proxy/main/api/v1/otp/generate", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ username }),
      });

      if (!res.ok) {
        const body = await res.json();
        toast.error(body.error);
        return;
      }

      toast.success("OTP requested");
      startTimer();
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
      username,
      otp: "",
    },
  });

  const onSubmit = async (data: ActivateFormValues) => {
    const res = await fetch("/proxy/main/api/v1/auth/activate", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      toast.error(body.error);
      return;
    }

    toast.success("Account activated!");
    router.push("/login");
  };

  useEffect(() => {
    if (!error) return;
    toast.error("message" in error ? error.message : "An error occurred");
  }, [error]);

  return (
    <Form onSubmit={(e) => void handleSubmit(onSubmit)(e)} autoComplete="off">
      <div className="grid grid-cols-1 w-full gap-4">
        <Controller
          name="otp"
          control={control}
          rules={{
            required: "Code is required",
            minLength: { value: 6, message: "Code must be 6 characters" },
            maxLength: { value: 6, message: "Code must be 6 characters" },
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
            onPress={() => void mutate()}
            isDisabled={isValidating}
            className="flex items-center gap-2 text-sm text-blue-500 hover:underline cursor-pointer disabled:text-neutral-400 disabled:pointer-events-none"
          >
            {isValidating ? (
              <Loader size={14} className="inline animate-spin" />
            ) : null}
            Get OTP code
          </Button>
        )}
      </div>
    </Form>
  );
}
