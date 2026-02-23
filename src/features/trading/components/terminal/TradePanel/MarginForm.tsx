import Decimal from "decimal.js";
import { useState } from "react";
import { Button, Form, type Key, ListBoxItem } from "react-aria-components";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { createOrder, setLeverage } from "@/api/trading";
import { Skeleton } from "@/components/common/Skeleton";
import { WithSkeleton } from "@/components/common/WithSkeleton";
import { CustomNumericField } from "@/components/ui/CustomNumericField";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/field";
import { usePosition } from "@/features/trading/hooks/usePosition";
import type {
  TradingInstrument,
  TradingOrderType,
  TradingSide,
  TradingTif,
} from "@/features/trading/types";
import { useUserBalance } from "@/features/user/hooks/useUserBalance";
import { formatDecimal } from "@/lib/decimal";
import { cls } from "@/utils/general.utils";
import { MarketSelect } from "./MarketSelect";

const LEVERAGES = ["2", "3", "5", "10", "20", "50", "100"] as const;
const TIF_OPTIONS = ["GTC", "IOC", "FOK"] as const;
const TIF_MAP: Record<string, string> = {
  GTC: "Good Till Cancel",
  IOC: "Immediate Or Cancel",
  FOK: "Fill Or Kill",
};

type TradeFormValues = {
  side: TradingSide;
  type: TradingOrderType;
  tif: TradingTif;
  qty: number; // base qty
  price: number;
};

const isTif = (key: Key | null) => {
  return key === "GTC" || key === "IOC" || key === "FOK";
};

export function MarginForm({ instrument }: { instrument: TradingInstrument }) {
  const { position, revalidate: revalidatePosition } = usePosition({
    symbol: instrument.symbol,
    enabled: true,
  });

  const { userBalance, revalidate: revalidateBalance } = useUserBalance({
    asset: instrument.quote,
    enabled: true,
  });

  const [selectedLeverage, setSelectedLeverage] = useState<string>("2");
  const [postOnly, setPostOnly] = useState<boolean>(false);

  const { control, setValue, handleSubmit } = useForm<TradeFormValues>({
    shouldUnregister: false,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      side: "BUY",
      type: "MARKET",
      tif: TIF_OPTIONS[0],
      qty: NaN,
      price: NaN,
    },
  });

  const [type, tif] = useWatch({
    control,
    name: ["type", "tif"],
  });

  const isLimit = type === "LIMIT";

  if (!instrument || !userBalance) {
    return (
      <div className="p-2">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  const tickSize = new Decimal(instrument.tickSize);
  const stepSize = new Decimal(instrument.stepSize);
  const minQty = new Decimal(instrument.minQty);
  const pricePrecision = instrument.pricePrecision;
  const qtyPrecision = instrument.quantityPrecision;

  const base = instrument.base;
  const quote = instrument.quote;

  const leverage = position ? position.leverage : selectedLeverage;

  const setLeverageValue = async (next: string) => {
    const prev = leverage;
    if (next === prev) return;

    setSelectedLeverage(next);

    const res = await setLeverage({
      symbol: instrument.symbol,
      leverage: next,
    });

    if (!res.res.ok) {
      setSelectedLeverage(prev);
      const body = res.body as { error?: string } | null;
      toast.error(body?.error ?? "Failed to update leverage");
      return;
    }

    revalidatePosition();
    revalidateBalance();

    toast.success(`Leverage set to x${next}`);
  };

  const onSubmit = async (data: TradeFormValues) => {
    const timeInForce = postOnly ? "POST_ONLY" : tif;
    const orderPrice = isLimit ? String(data.price) : null;
    const qty = String(data.qty);

    const res = await createOrder({
      symbol: instrument.symbol,
      category: "LINEAR",
      side: data.side,
      type: data.type,
      timeInForce,
      qty,
      price: orderPrice ?? undefined,
      reduceOnly: false,
    });

    if (!res.res.ok) {
      const body = res.body as { error?: string } | null;
      toast.error(body?.error ?? "Failed to create order");
      return;
    }

    revalidatePosition();
    revalidateBalance();

    toast.success("Order created");
  };

  const handleMarketType = (marketType: TradingOrderType) => {
    setValue("type", marketType);
  };

  return (
    <Form
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      className="flex flex-col gap-2 p-2 h-full"
    >
      <div className="flex items-center justify-between">
        <MarketSelect
          list={["MARKET", "LIMIT"]}
          value={type}
          onChange={(v) => {
            if (v !== "MARKET" && v !== "LIMIT") return;
            handleMarketType(v);
          }}
        />
        <CustomSelect<{ value: string }>
          items={LEVERAGES.map((value) => ({ value }))}
          selectProps={{
            placeholder: `x${leverage}`,
            selectedKey: leverage,
            onSelectionChange: (key) => {
              if (typeof key !== "string") return;
              setLeverageValue(key);
            },
          }}
        >
          {(item) => (
            <ListBoxItem
              key={item.value}
              id={item.value}
              className="p-2 text-xs focus:bg-neutral-900 focus:cursor-pointer focus:text-white"
              textValue={item.value}
            >
              <span>Leverage x{item.value}</span>
            </ListBoxItem>
          )}
        </CustomSelect>
      </div>

      <div className="flex flex-col gap-3 mb-8">
        <div className={cls("flex flex-col gap-3")}>
          <Controller
            name="price"
            control={control}
            rules={{}}
            render={({ field, fieldState }) => (
              <CustomNumericField
                numberFieldProps={{
                  className: cls({
                    "opacity-30 pointer-events-none": !isLimit,
                  }),
                  isDisabled: !isLimit,
                  minValue: tickSize.div(10).toNumber(),
                  step: tickSize.toNumber(),
                  formatOptions: {
                    maximumFractionDigits: pricePrecision,
                  },
                  ...field,
                  isInvalid: fieldState.invalid,
                }}
                inputProps={{
                  placeholder: "0.00",
                  autoComplete: "off",
                }}
                label="Price"
                units={quote}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <Controller
            name="qty"
            control={control}
            rules={{}}
            render={({ field, fieldState }) => (
              <CustomNumericField
                numberFieldProps={{
                  minValue:
                    minQty.isFinite() && minQty.gt(0)
                      ? minQty.toNumber()
                      : new Decimal("0.01").toNumber(),
                  step:
                    stepSize.isFinite() && stepSize.gt(0)
                      ? stepSize.toNumber()
                      : new Decimal("0.01").toNumber(),
                  formatOptions: {
                    maximumFractionDigits: qtyPrecision,
                  },
                  ...field,
                  isInvalid: fieldState.invalid,
                }}
                inputProps={{
                  placeholder: "0.00",
                  autoComplete: "off",
                }}
                label="Qty"
                units={base}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </div>

        <div className="flex items-center">
          <Checkbox
            className="cursor-pointer"
            isSelected={postOnly}
            onChange={(e) => {
              setPostOnly(e);
            }}
          >
            <Label className="cursor-pointer">
              <span className="text-xs">Post-Only</span>
            </Label>
          </Checkbox>

          <CustomSelect<{ value: string }>
            items={TIF_OPTIONS.map((value) => ({ value }))}
            selectProps={{
              className: "disabled:opacity-50 disabled:pointer-events-none",
              isDisabled: postOnly,
              placeholder: tif,
              selectedKey: tif,
              onSelectionChange: (key) => {
                if (!isTif(key)) return;
                setValue("tif", key);
              },
            }}
          >
            {(item) => (
              <ListBoxItem
                key={item.value}
                id={item.value}
                className={cls(
                  "p-2 text-xs focus:bg-neutral-900 focus:cursor-pointer focus:text-white",
                )}
                textValue={item.value}
              >
                <span>{TIF_MAP[item.value]}</span>
              </ListBoxItem>
            )}
          </CustomSelect>
        </div>

        <Checkbox className="cursor-pointer">
          <Label className="cursor-pointer">
            <span className="text-xs">Reduce-Only</span>
          </Label>
        </Checkbox>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <span className="font-bold text-sm">Unified Trading Account</span>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-fg">Margin Mode</span>
          <span className="text-xs">Isolated Margin</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Avaliable</span>
          <WithSkeleton
            data={{ userBalance }}
            skeleton={<Skeleton className="h-3 w-8" />}
          >
            {({ userBalance }) => (
              <p className="font-semibold">
                {formatDecimal(userBalance.available, pricePrecision)} {quote}
              </p>
            )}
          </WithSkeleton>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Locked & Margin</span>
          <WithSkeleton
            data={{ userBalance }}
            skeleton={<Skeleton className="h-3 w-8" />}
          >
            {({ userBalance }) => (
              <p className="font-semibold">
                {formatDecimal(userBalance.locked, pricePrecision)} {quote}
              </p>
            )}
          </WithSkeleton>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            className={cls(
              "px-4 py-3 bg-accent rounded-xs w-full cursor-pointer hover:brightness-150 transition-[filter] text-xs font-bold",
            )}
            onPress={() => {
              setValue("side", "BUY", { shouldValidate: true });
              void handleSubmit(onSubmit)();
            }}
          >
            Long
          </Button>

          <Button
            type="button"
            className={cls(
              "px-4 py-3 bg-red-400 rounded-xs w-full cursor-pointer hover:brightness-150 transition-[filter] text-xs font-bold",
            )}
            onPress={() => {
              setValue("side", "SELL", { shouldValidate: true });
              void handleSubmit(onSubmit)();
            }}
          >
            Short
          </Button>
        </div>
      </div>
    </Form>
  );
}
