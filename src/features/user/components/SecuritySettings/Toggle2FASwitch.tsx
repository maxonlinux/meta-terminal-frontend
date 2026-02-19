import { startTransition } from "react";
import { Group, Label } from "react-aria-components";
import { toast } from "sonner";
import { Skeleton } from "@/components/common/Skeleton";
import { WithSkeleton } from "@/components/common/WithSkeleton";
import { CustomSwitch } from "@/components/ui/CustomSwitch";
import { useUserSettings } from "@/features/user/hooks/useUserSettings";
import type { UserSettings } from "@/features/user/types";

const ToggleSkeleton = () => (
  <div className="flex gap-2 flex-wrap items-center">
    <Skeleton className="h-5 w-14 rounded-sm" />
    <Skeleton className="h-5 w-30 rounded-sm" />
  </div>
);

export function Toggle2FASwitch() {
  const { userSettings, updateUserSettings } = useUserSettings();

  const handleToggle = (value: boolean) => {
    startTransition(async () => {
      const res = await updateUserSettings({ is2FAEnabled: value });
      if (!res) {
        toast.error("Failed to update settings");
        return;
      }

      toast.success("Updated");
    });
  };

  return (
    <Group className="flex flex-col gap-4 p-4">
      <Label className="text-sm">Two-factor authentication</Label>
      <WithSkeleton<{ userSettings: UserSettings | null }>
        data={{ userSettings: userSettings ?? null }}
        skeleton={<ToggleSkeleton />}
      >
        {({ userSettings }) => (
          <div className="flex gap-4 flex-wrap items-center">
            <CustomSwitch
              isDisabled
              isSelected={userSettings.is2FAEnabled}
              onChange={handleToggle}
              label="Enable 2FA"
            />
            <div className="px-2 py-0 rounded-full bg-accent/20 text-accent text-xxs">
              Coming soon
            </div>
          </div>
        )}
      </WithSkeleton>
    </Group>
  );
}
