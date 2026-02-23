import { getCountryCallingCode } from "@/api/geo";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default async function Page() {
  const callingCode = await getCountryCallingCode();

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
