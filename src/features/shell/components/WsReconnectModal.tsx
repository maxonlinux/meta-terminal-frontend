"use client";

import { RefreshCcw, Unplug } from "lucide-react";
import { useRef } from "react";
import { OverlayProvider } from "react-aria";
import {
  Button,
  Dialog,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { useWsReconnectStatusStore } from "@/stores/useWsReconnectStatusStore";
import { cls } from "@/utils/general.utils";

export default function WsReconnectModal() {
  const modalRef = useRef<HTMLDivElement>(null);
  const { isExceeded } = useWsReconnectStatusStore();

  return (
    <OverlayProvider>
      <ModalOverlay
        isOpen={isExceeded}
        className={({ isEntering, isExiting }) =>
          cls(
            "fixed inset-0 z-50 bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur",
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
          <Dialog className="outline-hidden relative divide-y divide-border">
            <Heading
              slot="title"
              className="flex items-center justify-between text-xxl font-semibold leading-6 p-4"
            >
              OOPS... YOU&apos;VE BEEN DISCONNECTED
            </Heading>
            <div className="p-4 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2">
              <Unplug size={32} strokeWidth={1} className="row-span-2 mx-4" />
              <div>Reconnect limit exceeded</div>
              <div className="text-sm opacity-50">
                Real-time price data reconnect limit exceeded
                <br />
                Please, press the button below, or reload manually
              </div>
            </div>
            <div className="flex w-full p-2">
              <Button
                type="submit"
                aria-label="Register button"
                className="flex items-center gap-2 px-4 py-2 rounded-sm w-full bg-white text-black cursor-pointer"
                onClick={() => location.reload()}
              >
                <RefreshCcw size={14} /> Reload page
              </Button>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </OverlayProvider>
  );
}
