"use client";

import Decimal from "decimal.js";
import { Sliders, X } from "lucide-react";
import { useState } from "react";
import { OverlayProvider } from "react-aria";
import {
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  Form,
} from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { updatePositionTpSl } from "@/api/trading";
import { Button } from "@/components/ui/button";
import { CustomNumericField } from "@/components/ui/CustomNumericField";
import { useInstrument } from "@/features/trading/hooks/useInstrument";
import { useRealTimePrice } from "@/features/trading/hooks/useRealTimePrice";
import type { TradingPositionWithSide } from "@/features/trading/types";
import { formatDecimal, formatDecimalOrDash } from "@/lib/decimal";
import { cls } from "@/utils/general.utils";

const normalizeValue = (value: string) => (value === "0" ? "" : value);

export function PositionTpSlModal(props: {
  position: TradingPositionWithSide;
  onUpdatedAction: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { instrument } = useInstrument({ symbol: props.position.symbol });
  const quote = instrument?.quote ?? "";
  const { price: markPrice } = useRealTimePrice(props.position.symbol);
  const pricePrecision = instrument?.pricePrecision ?? 2;
  const qtyPrecision = instrument?.quantityPrecision ?? 8;
  const refPrice = markPrice ?? props.position.entryPrice;

  const { control, handleSubmit, reset, formState } = useForm<{
    takeProfit: number;
    stopLoss: number;
  }>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      takeProfit:
        props.position.takeProfit && props.position.takeProfit !== "0"
          ? Number(props.position.takeProfit)
          : Number.NaN,
      stopLoss:
        props.position.stopLoss && props.position.stopLoss !== "0"
          ? Number(props.position.stopLoss)
          : Number.NaN,
    },
  });
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      reset({
        takeProfit:
          props.position.takeProfit && props.position.takeProfit !== "0"
            ? Number(props.position.takeProfit)
            : Number.NaN,
        stopLoss:
          props.position.stopLoss && props.position.stopLoss !== "0"
            ? Number(props.position.stopLoss)
            : Number.NaN,
      });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    const tp = Number.isFinite(values.takeProfit)
      ? String(values.takeProfit)
      : "";
    const sl = Number.isFinite(values.stopLoss) ? String(values.stopLoss) : "";

    const res = await updatePositionTpSl({
      symbol: props.position.symbol,
      tp,
      sl,
    });

    if (!res.res.ok) {
      const body = res.body;
      const message =
        body && typeof body.message === "string"
          ? body.message
          : "Failed to update TP/SL";
      toast.error(message);
      return;
    }

    props.onUpdatedAction();
    setIsOpen(false);
    toast.success("TP/SL updated");
  });

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Button size="xs" intent="secondary">
        <Sliders className="size-3.5" />
        TP/SL
      </Button>
      <OverlayProvider>
        <ModalOverlay
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
            className={({ isEntering, isExiting }) =>
              cls(
                "@container w-full max-w-md overflow-y-auto max-h-full rounded-sm bg-secondary-background border border-border text-left text-white align-middle shadow-xl",
                {
                  "animate-in zoom-in-95 ease-out duration-300": isEntering,
                  "animate-out zoom-out-95 ease-in duration-200": isExiting,
                },
              )
            }
          >
            <Dialog className="outline-hidden relative divide-y divide-border">
              {({ close }) => (
                <>
                  <Heading
                    slot="title"
                    className="flex items-center justify-between text-xxl font-semibold leading-6 p-4"
                  >
                    EDIT TP/SL
                    <Button
                      intent="plain"
                      size="sq-xs"
                      className="cursor-pointer"
                      onClick={close}
                    >
                      <X />
                    </Button>
                  </Heading>
                  <Form className="flex flex-col gap-4 p-4" onSubmit={onSubmit}>
                    <div className="rounded-sm border border-white/10 bg-black/10 p-3 text-xs text-white/70">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Side</span>
                        <span
                          className={cls("font-semibold", {
                            "text-green-400": props.position.side === "BUY",
                            "text-red-400": props.position.side === "SELL",
                          })}
                        >
                          {props.position.side}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-white/60">Size</span>
                        <span className="font-semibold text-white">
                          {formatDecimal(props.position.size, qtyPrecision)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-white/60">Entry</span>
                        <span className="font-semibold text-white">
                          {formatDecimalOrDash(
                            props.position.entryPrice,
                            pricePrecision,
                          )}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-white/60">Mark</span>
                        <span className="font-semibold text-white">
                          {markPrice === null || markPrice === undefined
                            ? "--"
                            : formatDecimal(markPrice, pricePrecision)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-white/60">Leverage</span>
                        <span className="font-semibold text-white">
                          x{formatDecimalOrDash(props.position.leverage, 1)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Leave empty to disable
                    </p>
                    <Controller
                      control={control}
                      name="takeProfit"
                      rules={{
                        validate: (value) => {
                          if (!Number.isFinite(value)) return true;
                          const v = new Decimal(value);
                          if (!v.isFinite()) return "Invalid TP";
                          const m = new Decimal(refPrice);
                          if (!m.isFinite()) return true;
                          if (props.position.side === "BUY") {
                            return v.gt(m) || "TP must be above mark";
                          }
                          return v.lt(m) || "TP must be below mark";
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <CustomNumericField
                          label="Take profit"
                          units={quote}
                          errorMessage={fieldState.error?.message}
                          numberFieldProps={{
                            isInvalid: !!fieldState.error,
                            value: field.value,
                            onChange: field.onChange,
                          }}
                          inputProps={{
                            inputMode: "decimal",
                            placeholder: "0.00",
                          }}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="stopLoss"
                      rules={{
                        validate: (value) => {
                          if (!Number.isFinite(value)) return true;
                          const v = new Decimal(value);
                          if (!v.isFinite()) return "Invalid SL";
                          const m = new Decimal(refPrice);
                          if (!m.isFinite()) return true;
                          if (props.position.side === "BUY") {
                            return v.lt(m) || "SL must be below mark";
                          }
                          return v.gt(m) || "SL must be above mark";
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <CustomNumericField
                          label="Stop loss"
                          units={quote}
                          errorMessage={fieldState.error?.message}
                          numberFieldProps={{
                            isInvalid: !!fieldState.error,
                            value: field.value,
                            onChange: field.onChange,
                          }}
                          inputProps={{
                            inputMode: "decimal",
                            placeholder: "0.00",
                          }}
                        />
                      )}
                    />
                    <div className="flex items-center justify-end gap-2">
                      <Button intent="secondary" type="button" onClick={close}>
                        Cancel
                      </Button>
                      <Button
                        intent="primary"
                        type="submit"
                        isDisabled={formState.isSubmitting}
                      >
                        {formState.isSubmitting ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </Form>
                </>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </OverlayProvider>
    </DialogTrigger>
  );
}
