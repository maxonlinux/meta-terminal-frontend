"use client";

import { ShieldUser } from "lucide-react";
import { useCallback, useState } from "react";
import {
  Button,
  Disclosure,
  DisclosurePanel,
  Heading,
  Label,
  Link,
} from "react-aria-components";
import { toast } from "sonner";
import defaultTheme from "tailwindcss/defaultTheme";
import { useIsMounted, useMediaQuery } from "usehooks-ts";
import { DropDownIcon } from "@/components/common/DropIcons";
import { Skeleton } from "@/components/common/Skeleton";
import { WithSkeleton } from "@/components/common/WithSkeleton";
import { CustomSwitch } from "@/components/ui/CustomSwitch";
import { useUserSettings } from "@/features/user/hooks/useUserSettings";
import type { UserSettings } from "@/features/user/types";
import { cls } from "@/utils/general.utils";

const toggles: {
  key: keyof Omit<UserSettings, "id" | "userId" | "preferences">;
  title: string;
  label: string;
}[] = [
  {
    key: "newsAndOffers",
    title: "News and Offers",
    label:
      "Allow the platform to send you unique offers and notifications to your email address",
  },
  {
    key: "accessToTransactionData",
    title: "Access to transaction data",
    label:
      "Allow the platform to collect transaction data for the purpose of improving service quality",
  },
  {
    key: "accessToGeolocation",
    title: "Access to geolocation",
    label:
      "Allow the platform to collect data about your location for statistical purposes",
  },
];

const SettingSkeleton = () => (
  <div className="flex flex-col gap-2 p-6">
    <Skeleton className="h-4 w-40 rounded-sm" />
    <div className="flex gap-4 items-center">
      <Skeleton className="h-4 w-80 rounded-sm" />
    </div>
  </div>
);

export default function PrivacySettings() {
  const { userSettings, updateUserSettings } = useUserSettings();
  const [isExpanded, setIsExpanded] = useState(true);

  const isMounted = useIsMounted();
  const matches = useMediaQuery(`(max-width: ${defaultTheme.screens.lg})`);

  const isMobile = isMounted() && matches;
  const stateExpanded = isMobile ? isExpanded : true;

  const handleToggle = useCallback(
    async (key: string, isSelected: boolean) => {
      const res = await updateUserSettings({ [key]: isSelected });
      if (!res) {
        toast.error("Failed to update settings");
        return;
      }

      toast.success("Updated");
    },
    [updateUserSettings],
  );

  return (
    <Disclosure isExpanded={stateExpanded}>
      <Heading>
        <Label
          className={cls(
            "flex items-center justify-between p-2 m-2 rounded-xs",
            "max-lg:hover:bg-neutral-900 max-lg:cursor-pointer",
          )}
        >
          <div className="flex gap-2 items-center">
            <ShieldUser size={20} />
            <p className="font-semibold text-xl">Privacy</p>
          </div>
          {matches && (
            <Button
              className={cls({ "rotate-180": stateExpanded })}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <DropDownIcon />
            </Button>
          )}
        </Label>
      </Heading>
      <DisclosurePanel>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col divide-y divide-border border border-border rounded-sm">
            {toggles.map((toggle) => (
              <WithSkeleton<{ userSettings: UserSettings | null }>
                key={toggle.key}
                data={{ userSettings: userSettings ?? null }}
                skeleton={<SettingSkeleton />}
              >
                {({ userSettings }) => (
                  <div className="flex flex-col gap-2 p-6">
                    <span className="">{toggle.title}</span>
                    <div className="flex gap-4 items-center">
                      <CustomSwitch
                        label={toggle.label}
                        isSelected={userSettings[toggle.key]}
                        onChange={(isSelected) => {
                          handleToggle(toggle.key, isSelected);
                        }}
                      />
                    </div>
                  </div>
                )}
              </WithSkeleton>
            ))}
          </div>
          <p className="text-sm px-4 text-current/50">
            We do not send or sell your personal information to third parties.{" "}
            <Link
              className="text-accent whitespace-nowrap underline"
              href="/legal/privacy"
            >
              Privacy Policy
            </Link>{" "}
            .
          </p>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
