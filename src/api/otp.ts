import { requestJson } from "@/api/http";

export async function generateOtp(data: { username: string }) {
  return requestJson<{ message?: string; error?: string }>(
    "/proxy/main/api/v1/otp/generate",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
}

export async function validateOtp(data: { username: string; otp: string }) {
  return requestJson<{ message?: string; error?: string }>(
    "/proxy/main/api/v1/otp/validate",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
}
