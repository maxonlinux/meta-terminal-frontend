"use client";

import {
  ChevronLeft,
  ExternalLink,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Menu as MenuPrimitive } from "react-aria-components";
import { Button } from "@/components/ui/button";
import { MenuItem, MenuLabel, MenuSection } from "@/components/ui/menu";
import {
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useEnv } from "@/env/provider";
import { LogoutButton } from "./LogoutButton";

export function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const env = useEnv();

  const links = [
    { name: "Trade", link: "/trade", icon: LayoutDashboard },
    { name: "Assets", link: "/assets", icon: Wallet },
    { name: "Settings", link: "/settings", icon: Settings },
    { name: "Support", link: env.SUPPORT_LINK, icon: LifeBuoy },
  ];

  const legal = [
    { name: "Privacy Policy", link: "/trade", icon: ExternalLink },
    { name: "Terms of Use", link: "/assets", icon: ExternalLink },
    { name: "AML Policy", link: "/settings", icon: ExternalLink },
    { name: "Risk Statement", link: env.SUPPORT_LINK, icon: ExternalLink },
  ];

  return (
    <>
      <Button
        intent="plain"
        onPress={() => setIsOpen(true)}
        className="group flex items-center gap-1 cursor-pointer p-1"
      >
        <ChevronLeft size={12} />
        <User size={18} strokeWidth={2} className="text-neutral-300" />
      </Button>
      <SheetContent isOpen={isOpen} onOpenChange={setIsOpen}>
        <SheetHeader>
          <SheetTitle>Main menu</SheetTitle>
          <SheetDescription>
            {/* Please let us know your thoughts and how we can improve our service. */}
          </SheetDescription>
        </SheetHeader>
        <SheetBody>
          <MenuPrimitive className="divide-y *:[[role=group]]:py-2">
            <MenuSection label="Navigation">
              {links.map((link) => (
                <MenuItem
                  key={link.link}
                  href={link.link}
                  className="cursor-pointer data-hovered:bg-white/10 focus:bg-white/5"
                >
                  <link.icon data-slot="icon" className="size-3.5" />
                  <MenuLabel>{link.name}</MenuLabel>
                </MenuItem>
              ))}
            </MenuSection>
            <MenuSection label="Legal">
              {legal.map((link) => (
                <MenuItem
                  key={link.link}
                  href={link.link}
                  className="cursor-pointer data-hovered:bg-white/10 focus:bg-white/5"
                >
                  <link.icon data-slot="icon" className="size-3.5" />
                  <MenuLabel>{link.name}</MenuLabel>
                </MenuItem>
              ))}
            </MenuSection>
          </MenuPrimitive>
        </SheetBody>
        <SheetFooter>
          <LogoutButton />
        </SheetFooter>
      </SheetContent>
    </>
  );
}
