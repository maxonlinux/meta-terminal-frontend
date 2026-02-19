import type { CountryCallingCode } from "libphonenumber-js";
import { requestJson } from "@/api/http";

type IpApiResponse = {
  country_calling_code?: string;
};

export async function getCountryCallingCode(): Promise<CountryCallingCode> {
  const { res, body } = await requestJson<IpApiResponse>(
    "https://ipapi.co/json/",
  );
  if (!res.ok) return "+1" as CountryCallingCode;
  return (body?.country_calling_code ?? "+1") as CountryCallingCode;
}
