import AccountSettings from "@/features/user/components/AccountSettings/AccountSettings";
import PrivacySettings from "@/features/user/components/PrivacySettings";
import SecuritySettings from "@/features/user/components/SecuritySettings/SecuritySettings";
import VerificationSettings from "@/features/user/components/VerificationSettings/VerificationSettings";
import { cls } from "@/utils/general.utils";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div
      className={cls(
        "grid grid-cols-2 gap-px max-xs:grid-cols-1 max-lg:grid-cols-1 w-full rounded-xs border border-transparent",
        "*:bg-secondary-background bg-white/10 overflow-hidden",
      )}
    >
      <AccountSettings />
      <SecuritySettings />
      <VerificationSettings />
      <PrivacySettings />
    </div>
  );
}
