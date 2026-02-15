import LoginForm from "@/features/auth/components/LoginForm";

export default async function Page() {
  return (
    <>
      <h1 className="flex items-center gap-3 font-semibold text-2xl mb-4">
        Welcome back!
      </h1>
      <p className="mb-8 text-sm text-current/50">
        Log in to your account to continue your journey
      </p>
      <LoginForm />
    </>
  );
}
