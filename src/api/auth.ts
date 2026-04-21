import { requestJson } from "@/api/http";

export async function login(data: { username: string; password: string }) {
  return requestJson<{ token?: string; error?: string }>(
    "/proxy/main/api/v1/auth/login",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
}

export async function register(data: {
  email: string;
  username: string;
  password: string;
  phone: string;
}) {
  return requestJson<{ userId?: string; error?: string }>(
    "/proxy/main/api/v1/auth/register",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
}

export async function activate(data: { username: string; otp: string }) {
  return requestJson<{ message?: string; error?: string }>(
    "/proxy/main/api/v1/auth/activate",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
}

export async function recovery(data: { username: string; otp: string }) {
  return requestJson<{ message?: string; error?: string }>(
    "/proxy/main/api/v1/auth/recovery",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
}

export async function logout() {
  const { res } = await requestJson<null>("/proxy/main/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  return res.ok;
}

export async function impersonate(token: string) {
  return requestJson<{ token?: string; error?: string }>(
    `/proxy/main/api/v1/auth/impersonate/${token}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
}
