import type { CountryCallingCode } from "libphonenumber-js";
import RegisterForm from "@/features/auth/components/RegisterForm";

const getUserCountryCallingCode = async (): Promise<CountryCallingCode> => {
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) return "+1" as CountryCallingCode;

  const body = await res.json();
  return body.country_calling_code;
};

export default async function Page() {
  const callingCode = await getUserCountryCallingCode();

  return (
    <>
      <h1 className="flex items-center gap-3 font-semibold text-2xl mb-4">
        Welcome!
      </h1>
      <p className="mb-8 text-sm text-current/50">
        Create an account and start trading with us
      </p>
      <RegisterForm callingCode={callingCode} />
    </>
  );
}
