// import { cookies } from "next/headers";
import LandingFooter from "@/features/landing/components/LandingFooter";
import LandingHeader from "@/features/landing/components/LandingHeader";

// async function hasAuthCookie(): Promise<boolean> {
//   const c = await cookies();
//   const token = c.get("token")?.value;

//   if (!token) return false;
//   return true;
// }

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const isAuthenticated = await hasAuthCookie();

  return (
    <>
      <LandingHeader />
      <div
        className="flex flex-col"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
          paddingRight: "env(safe-area-inset-right)",
          paddingLeft: "env(safe-area-inset-left)",
        }}
      >
        <main className="w-full overflow-hidden">{children}</main>
      </div>
      <LandingFooter />
    </>
  );
}
