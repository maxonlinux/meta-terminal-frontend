import RecoveryForm from "@/features/auth/components/RecoveryForm";

export default async function Page() {
  return (
    <>
      <h1 className="flex items-center gap-3 font-semibold text-2xl mb-4">
        One-Time Access
      </h1>
      <p className="mb-8 text-sm text-current/50">
        Access your account using one-time password
      </p>
      <RecoveryForm />
    </>
  );
}
