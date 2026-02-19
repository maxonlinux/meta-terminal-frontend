"use client";

import { CircleUser } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Disclosure,
  DisclosurePanel,
  Heading,
  Label,
} from "react-aria-components";
import defaultTheme from "tailwindcss/defaultTheme";
import { useIsMounted, useMediaQuery } from "usehooks-ts";
import { DropDownIcon } from "@/components/common/DropIcons";
import { Skeleton } from "@/components/common/Skeleton";
import { WithSkeleton } from "@/components/common/WithSkeleton";
import { useUserAddress } from "@/features/user/hooks/useUserAddress";
import { useUserProfile } from "@/features/user/hooks/useUserProfile";
import type { UserAddress, UserProfile } from "@/features/user/types";
import { cls } from "@/utils/general.utils";
import { AddressForm } from "./AddressForm";
import { ProfileForm } from "./ProfileForm";

const ProfileFormSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    <p className="text-sm">Basic data</p>
    <div className="grid grid-cols-2 gap-4 max-xs:grid-cols-1">
      <Skeleton className="w-full h-10.5 mt-1.5 rounded-sm" />
      <Skeleton className="w-full h-10.5 mt-1.5 rounded-sm" />
      <Skeleton className="w-full h-10.5 mt-1.5 rounded-sm" />
      <Skeleton className="w-full h-10.5 mt-1.5 rounded-sm" />
      <Skeleton className="w-full h-10.5 mt-1.5 rounded-sm" />
    </div>
    <div>
      <Skeleton className="w-36 h-11 rounded-md" />
    </div>
  </div>
);

const AddressFormSkeleton = () => (
  <div className="flex flex-col gap-4 p-4">
    <p className="text-sm">Address</p>
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 max-xs:grid-cols-1">
      <Skeleton className="w-full h-10.5 mt-1.5 rounded-sm" />
      <Skeleton className="w-full h-10.5 mt-1.5 rounded-sm" />
      <Skeleton className="w-full h-10.5 mt-1.5 rounded-sm" />
      <Skeleton className="w-full h-10.5 mt-1.5 rounded-sm" />
    </div>
    <div>
      <Skeleton className="w-36 h-11 rounded-md" />
    </div>
  </div>
);

export default function AccountSettings() {
  const [isExpanded, setIsExpanded] = useState(true);

  const isMounted = useIsMounted();
  const matches = useMediaQuery(`(max-width: ${defaultTheme.screens.lg})`);

  const { userAddress } = useUserAddress();
  const { userProfile } = useUserProfile();

  const isMobile = isMounted() && matches;

  const stateExpanded = isMobile ? isExpanded : true;

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
            <CircleUser size={20} />
            <p className="font-semibold text-xl">General</p>
          </div>
          {isMobile && (
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
        <WithSkeleton<{ userProfile: UserProfile | null }>
          data={{ userProfile: userProfile ?? null }}
          skeleton={<ProfileFormSkeleton />}
        >
          {({ userProfile }) => <ProfileForm userProfile={userProfile} />}
        </WithSkeleton>
        <WithSkeleton<{ userAddress: UserAddress | null }>
          data={{ userAddress: userAddress ?? null }}
          skeleton={<AddressFormSkeleton />}
        >
          {({ userAddress }) => <AddressForm userAddress={userAddress} />}
        </WithSkeleton>
      </DisclosurePanel>
    </Disclosure>
  );
}
