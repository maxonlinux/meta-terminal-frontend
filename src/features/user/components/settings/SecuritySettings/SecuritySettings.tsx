"use client";

import { Fingerprint } from "lucide-react";
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
import { cls } from "@/utils/general.utils";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { Toggle2FASwitch } from "./Toggle2FASwitch";

export default function SecuritySettings() {
  const [isExpanded, setIsExpanded] = useState(true);

  const isMounted = useIsMounted();
  const matches = useMediaQuery(`(max-width: ${defaultTheme.screens.lg})`);

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
            <Fingerprint size={20} />
            <p className="font-semibold text-xl">Security</p>
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
        <ChangePasswordForm />
        <Toggle2FASwitch />
      </DisclosurePanel>
    </Disclosure>
  );
}
