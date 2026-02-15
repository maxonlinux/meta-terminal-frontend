"use client";

import { X } from "lucide-react";
import { useRef } from "react";
import { OverlayProvider } from "react-aria";
import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { WithSkeleton } from "@/components/common/WithSkeleton";
import { useUserProfile } from "@/features/user/hooks/useUserProfile";
import type { UserProfile } from "@/features/user/types";
import { useOtpActionStore } from "@/stores/useOtpActionStore";
import { cls } from "@/utils/general.utils";
import { OtpForm } from "./OtpForm";

const ModalContent = () => {
  const { userProfile } = useUserProfile();
  const { clearOtpAction } = useOtpActionStore();

  return (
    <Dialog className="outline-hidden relative divide-y divide-border">
      <Heading
        slot="title"
        className="flex items-center justify-between text-xxl font-semibold leading-6 p-4"
      >
        OTP CONFIRMATION
        <Button className="cursor-pointer" onClick={clearOtpAction}>
          <X />
        </Button>
      </Heading>
      <div className="p-4">
        <WithSkeleton<{ userProfile: UserProfile | null }>
          data={{ userProfile: userProfile ?? null }}
          skeleton={undefined}
        >
          {({ userProfile }) => <OtpForm username={userProfile.username} />}
        </WithSkeleton>
      </div>
    </Dialog>
  );
};

export default function OtpModal() {
  const modalRef = useRef<HTMLDivElement>(null);
  const { otpAction } = useOtpActionStore();

  return (
    <OverlayProvider>
      <ModalOverlay
        isOpen={!!otpAction}
        isDismissable
        className={({ isEntering, isExiting }) =>
          cls(
            "fixed inset-0 z-10 bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur",
            {
              "animate-in fade-in duration-300 ease-out": isEntering,
              "animate-out fade-out duration-200 ease-in": isExiting,
            },
          )
        }
      >
        <Modal
          ref={modalRef}
          className={({ isEntering, isExiting }) =>
            cls(
              "@container w-full max-w-md overflow-y-auto max-h-full rounded-sm bg-background border border-border text-left text-white align-middle shadow-xl",
              {
                "animate-in zoom-in-95 ease-out duration-300": isEntering,
                "animate-out zoom-out-95 ease-in duration-200": isExiting,
              },
            )
          }
        >
          <ModalContent />
        </Modal>
      </ModalOverlay>
    </OverlayProvider>
  );
}
