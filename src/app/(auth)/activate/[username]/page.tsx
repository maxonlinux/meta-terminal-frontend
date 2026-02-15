import { ActivateForm } from "@/features/auth/components/ActivateForm";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const p = await params;
  const { username } = p;

  return (
    <>
      <h1 className="flex items-center gap-3 font-semibold text-2xl mb-4">
        Activation
      </h1>
      <p className="mb-8 text-sm text-current/50">
        Please enter the OTP code sent to your email or phone
      </p>
      <ActivateForm username={username} />
    </>
  );
}
