import AccountSettings from "@/features/user/components/settings/AccountSettings/AccountSettings";
import PrivacySettings from "@/features/user/components/settings/PrivacySettings";
import SecuritySettings from "@/features/user/components/settings/SecuritySettings/SecuritySettings";
import VerificationSettings from "@/features/user/components/settings/VerificationSettings";
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
