import { requestJson } from "@/api/http";
import type {
  DepositRequestInput,
  FundingRequest,
  KycRequest,
  UserAddress,
  UserBalance,
  UserPlan,
  UserProfile,
  UserSettings,
  WithdrawRequestInput,
} from "@/features/user/types";

export async function getUserBalances(): Promise<UserBalance[]> {
  const { res, body } = await requestJson<UserBalance[]>(
    "/proxy/main/api/v1/user/balances",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}

export async function getUserBalance(
  asset: string,
): Promise<UserBalance | null> {
  const { res, body } = await requestJson<UserBalance>(
    `/proxy/main/api/v1/user/balance?asset=${asset}`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return null;
  return body ?? null;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const { res, body } = await requestJson<UserProfile>(
    "/proxy/main/api/v1/user/profile",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return null;
  return body ?? null;
}

export async function updateUserProfile(data: {
  name?: string;
  surname?: string;
}): Promise<UserProfile | null> {
  const { res, body } = await requestJson<UserProfile>(
    "/proxy/main/api/v1/user/profile",
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  if (!res.ok) return null;
  return body ?? null;
}

export async function getUserSettings(): Promise<UserSettings | null> {
  const { res, body } = await requestJson<UserSettings>(
    "/proxy/main/api/v1/user/settings",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return null;
  return body ?? null;
}

export async function updateUserSettings(data: Partial<UserSettings>) {
  return requestJson<UserSettings>("/proxy/main/api/v1/user/settings", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getUserAddress(): Promise<UserAddress | null> {
  const { res, body } = await requestJson<UserAddress>(
    "/proxy/main/api/v1/user/settings/address",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return null;
  return body ?? null;
}

export async function updateUserAddress(data: {
  country?: string;
  city?: string;
  address?: string;
  zip?: string;
}) {
  return requestJson<UserAddress>("/proxy/main/api/v1/user/settings/address", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function updateUserPassword(data: {
  oldPassword: string;
  newPassword: string;
}) {
  return requestJson<{ message: string }>(
    "/proxy/main/api/v1/user/settings/password",
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
}

export async function getUserPlan(): Promise<UserPlan | null> {
  const { res, body } = await requestJson<UserPlan>(
    "/proxy/main/api/v1/user/plan",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return null;
  return body ?? null;
}

export async function getUserTransactions(): Promise<FundingRequest[]> {
  const { res, body } = await requestJson<FundingRequest[]>(
    "/proxy/main/api/v1/user/funding",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return [];
  return Array.isArray(body) ? body : [];
}

export async function createWithdrawalTransaction(data: WithdrawRequestInput) {
  return requestJson<FundingRequest>(
    "/proxy/main/api/v1/user/funding/withdraw",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        asset: data.asset,
        amount: String(data.amount),
        destination: data.destination,
      }),
    },
  );
}

export async function createDepositTransaction(data: DepositRequestInput) {
  return requestJson<FundingRequest>(
    "/proxy/main/api/v1/user/funding/deposit",
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        walletId: data.walletId,
        amount: String(data.amount),
      }),
    },
  );
}

export async function getUserKyc(): Promise<KycRequest | null> {
  const { res, body } = await requestJson<KycRequest>(
    "/proxy/main/api/v1/user/kyc",
    {
      method: "GET",
      credentials: "include",
    },
  );
  if (!res.ok) return null;
  return body ?? null;
}

export async function submitUserKyc(form: FormData) {
  const { res, body } = await requestJson<KycRequest>(
    "/proxy/main/api/v1/user/kyc",
    {
      method: "POST",
      credentials: "include",
      body: form,
    },
  );
  return { res, body };
}
