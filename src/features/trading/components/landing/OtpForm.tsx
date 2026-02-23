"use client";

import { Loader } from "lucide-react";

import { Button, Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import { useCountdown } from "usehooks-ts";
import { ApiError } from "@/api/http";
import { generateOtp, validateOtp } from "@/api/otp";
import { CustomOtpField } from "@/components/ui/CustomOtpFIeld";
import type { ActivateForm } from "@/features/auth/types";
import { useOtpActionStore } from "@/stores/useOtpActionStore";

export function OtpForm({ username }: { username: string }) {
  const { otpAction, clearOtpAction } = useOtpActionStore();

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 60,
    intervalMs: 1000,
  });

  const { data, isValidating, mutate } = useSWR(
    "otp:generate",
    async () => {
      const res = await generateOtp({ username });
      if (!res.res.ok) {
        return null;
      }
      const text = res.body?.message ?? "OTP sent";

      resetCountdown();
      startCountdown();

      return text;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
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

  const onSubmit = async (data: ActivateForm) => {
    try {
      const res = await validateOtp(data);
      if (!res.res.ok) {
        throw new ApiError({
          status: res.res.status,
          code: res.body?.error ?? "REQUEST_FAILED",
          body: res.body,
        });
      }

      if (otpAction) {
        await otpAction();
        clearOtpAction();
      }
    } catch (err) {
      toast.error(err instanceof ApiError ? err.code : "REQUEST_FAILED");
    }
  };

  const resendOtp = async () => {
    try {
      await mutate();
      toast.success("OTP re-sent");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.code : "Failed to resend OTP");
    }
  };

  return (
    <Form onSubmit={(e) => void handleSubmit(onSubmit)(e)} autoComplete="off">
      <div className="grid grid-cols-1 w-full gap-4">
        {data && <span className="text-sm opacity-50">{data}</span>}
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
        <Button
          type="submit"
          isDisabled={formState.isSubmitting}
          aria-label="Register button"
          className="flex items-center gap-2 px-4 py-2 rounded-sm w-full bg-white text-black disabled:opacity-50 cursor-pointer"
        >
          {formState.isSubmitting && (
            <Loader size={14} className="inline animate-spin" />
          )}
          Confirm
        </Button>
      </div>
      <div className="flex justify-end mt-2">
        {count > 0 ? (
          <span className="text-sm opacity-50">Get code in {count} sec</span>
        ) : (
          <Button
            type="button"
            onPress={() => {
              void resendOtp();
            }}
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
