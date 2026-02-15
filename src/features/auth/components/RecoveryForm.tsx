"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form } from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCountdown } from "usehooks-ts";
import { apiFetch } from "@/api/http";
import { CustomOtpField } from "@/components/ui/CustomOtpFIeld";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { SubmitButton } from "@/features/auth/components/SubmitButton";

const SubmitOtpForm = ({
  username,
  onCancel,
}: {
  username: string;
  onCancel: () => void;
}) => {
  const { handleSubmit, control, formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username,
      otp: "",
    },
  });

  const [count, { startCountdown, resetCountdown }] = useCountdown({
    countStart: 5,
    intervalMs: 1000,
  });

  const isCooldown = count > 0;

  const submit = async (params: { username: string; otp: string }) => {
    const res = await apiFetch("/auth/recovery", {
      method: "POST",
      body: JSON.stringify({ username: params.username, otp: params.otp }),
    });

    if (res.ok) {
      toast.success("Login success");
      redirect("/settings");
    }

    const body = await res.json();
    toast.error(body.error);
  };

  const regenerate = async () => {
    const res = await apiFetch("/otp/generate", {
      method: "POST",
      body: JSON.stringify({ username }),
    });

    if (res.ok) {
      resetCountdown();
      startCountdown();
      toast.success("OTP sent");
      return;
    }
    const body = await res.json();
    toast.error(body.error);
  };

  useEffect(() => {
    startCountdown();
  }, [startCountdown]);

  return (
    <Form onSubmit={(e) => handleSubmit(submit)(e)}>
      <div className="grid grid-cols-1 w-full gap-4">
        <div className="flex items-center justify-between">
          <Button
            className="flex items-center gap-2 text-sm hover:text-neutral-300"
            onClick={onCancel}
          >
            <ArrowLeft className="size-4" /> Go back
          </Button>

          <Button
            isDisabled={isCooldown}
            className="text-sm"
            onClick={() => regenerate()}
          >
            {isCooldown ? (
              <span className="text-current/50 text-sm">{count} sec</span>
            ) : (
              <span className="text-primary underline underline-offset-4">
                Request OTP
              </span>
            )}
          </Button>
        </div>

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
      <div className="flex flex-col gap-4 w-full mt-4">
        <SubmitButton isSubmitting={formState.isSubmitting} label="Submit" />
      </div>
    </Form>
  );
};

export default function RecoveryForm() {
  const { handleSubmit, control, formState, watch } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
    },
  });

  const { username } = watch();

  const [otpRequested, setOtpRequested] = useState(false);

  const request = async (params: { username: string }) => {
    const res = await apiFetch("/otp/generate", {
      method: "POST",
      body: JSON.stringify({ username: params.username }),
    });

    if (res.ok) {
      setOtpRequested(true);
      toast.success("OTP sent");
      return;
    }

    const body = await res.json();
    toast.error(body.error);
  };

  if (otpRequested)
    return (
      <SubmitOtpForm
        username={username}
        onCancel={() => setOtpRequested(false)}
      />
    );

  return (
    <Form onSubmit={(e) => handleSubmit(request)(e)}>
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
      </div>
      <div className="flex flex-col items-center gap-4 w-full mt-4">
        <SubmitButton isSubmitting={formState.isSubmitting} label="Submit" />

        <div className="w-full text-sm">
          <Link className="text-accent underline" href="/register">
            Register
          </Link>{" "}
          <span className="text-neutral-500">|</span>{" "}
          <Link className="text-accent underline" href="/login">
            Login
          </Link>
        </div>
      </div>
    </Form>
  );
}
