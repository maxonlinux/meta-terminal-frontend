import Decimal from "decimal.js";
import { Info, LockKeyhole } from "lucide-react";
import { Button, Form, Group, Radio, RadioGroup } from "react-aria-components";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { createOrder } from "@/api/trading";
import { Skeleton } from "@/components/common/Skeleton";
import { WithSkeleton } from "@/components/common/WithSkeleton";
import { CustomNumericField } from "@/components/ui/CustomNumericField";
import { useRealTimePrice } from "@/features/trading/hooks/useRealTimePrice";
import type {
  TradingInstrument,
  TradingOrderType,
  TradingSide,
} from "@/features/trading/types";
import { useUserBalance } from "@/features/user/hooks/useUserBalance";
import { formatDecimal } from "@/lib/decimal";
import { cls } from "@/utils/general.utils";
import { MarketSelect } from "./MarketSelect";

const MARKET_TYPES = ["MARKET", "LIMIT"];
const ORDER_SIDES = ["BUY", "SELL"];
const PERCENTAGES = [0, 0.25, 0.5, 0.75, 1];

type TradeFormValues = {
  side: TradingSide;
  type: TradingOrderType;
  amount: number;
  price: number;
};

const Hint = ({
  side,
  symbol,
  amount,
  isLimit,
  currency,
  limitPrice,
  availableBalance,
  availableAssets,
}: {
  side: TradingSide;
  symbol: string;
  amount: number;
  isLimit: boolean;
  currency: string;
  limitPrice?: number;
  availableBalance: string;
  availableAssets: string;
}) => {
  const { price } = useRealTimePrice(symbol);

  if (!price) {
    return <Skeleton className="h-3 w-8 bg-white/30 rounded-xs" />;
  }

  const calculateTotal = () => {
    const amountDec = new Decimal(amount || 0);
    if (amountDec.lte(0)) return null;

    const actualPrice = isLimit
      ? new Decimal(limitPrice || 0)
      : new Decimal(price);

    if (!actualPrice.isFinite() || actualPrice.lte(0)) return null;

    return amountDec.mul(actualPrice);
  };

  const total = calculateTotal();

  const calculateExceeded = () => {
    if (!total) return false;

    const balanceDec = new Decimal(availableBalance);
    const assetsDec = new Decimal(availableAssets);
    const amountDec = new Decimal(amount || 0);

    if (side === "BUY") return total.gt(balanceDec);
    if (side === "SELL") return amountDec.gt(assetsDec);

    return false;
  };

  const isExceeded = calculateExceeded();

  return (
    <div className="flex items-center justify-between w-full ml-auto text-xxs">
      <span className="flex items-center gap-1 opacity-50">
        <Info size={10} />
        Est. total ({currency})
      </span>
      <span
        className={cls({
          "text-red-400": isExceeded,
        })}
      >
        {total ? formatDecimal(total, 2) : "****"} {currency}
      </span>
    </div>
  );
};

const PercentageButtons = ({
  onSelect,
  symbol,
  side,
  availableAssets,
  availableBalance,
  precision,
  isLimit,
  limitPrice,
}: {
  onSelect: (value: number) => void;
  symbol: string;
  side: TradingSide;
  availableBalance: string;
  availableAssets: string;
  precision: number;
  isLimit: boolean;
  limitPrice: number;
}) => {
  const { price: realTimePrice } = useRealTimePrice(symbol);

  let effectivePrice: Decimal | null = null;
  if (isLimit) {
    const limit = new Decimal(limitPrice || 0);
    if (limit.gt(0)) effectivePrice = limit;
  } else if (typeof realTimePrice === "number") {
    effectivePrice = new Decimal(realTimePrice);
  }
  if (!effectivePrice) return null;

  const floorToPrecision = (value: Decimal) =>
    value.toDecimalPlaces(precision, Decimal.ROUND_DOWN);

  return (
    <Group
      className="flex gap-2 text-xs text-white/50 justify-end"
      aria-label="Percentage"
    >
      {PERCENTAGES.map((perc) => (
        <Button
          key={perc}
          className="cursor-pointer text-white/50 underline-offset-2 whitespace-nowrap font-semibold hover:underline hover:text-white"
          onPress={() => {
            let value = new Decimal(0);

            if (side === "BUY") {
              const balanceDec = new Decimal(availableBalance);
              const percent = new Decimal(perc);
              value = floorToPrecision(
                balanceDec.div(effectivePrice).mul(percent),
              );
            }

            if (side === "SELL") {
              const assetsDec = new Decimal(availableAssets);
              const percent = new Decimal(perc);
              value = floorToPrecision(assetsDec.mul(percent));
            }

            onSelect(value.toNumber());
          }}
        >
          {100 * perc}%
        </Button>
      ))}
    </Group>
  );
};

export function SpotForm({ instrument }: { instrument: TradingInstrument }) {
  const { control, setValue, handleSubmit } = useForm<TradeFormValues>({
    shouldUnregister: false,
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      side: "BUY",
      type: "MARKET",
      amount: NaN,
      price: NaN,
    },
  });

  const [amount, side, price, type] = useWatch({
    control,
    name: ["amount", "side", "price", "type"],
  });

  const isLimit = type === "LIMIT";

  const base = instrument.base;
  const quote = instrument.quote;

  const { userBalance: quoteBal, revalidate: revalidateQuote } = useUserBalance(
    {
      asset: quote,
      enabled: true,
    },
  );

  const { userBalance: baseBal, revalidate: revalidateBase } = useUserBalance({
    asset: base,
    enabled: true,
  });

  if (!baseBal || !quoteBal) {
    // return <Skeleton className="w-full h-full rounded-xs" />;
    return (
      <div className="flex items-center justify-center size-full bg-bg/50">
        <div className="flex flex-col items-center gap-2 text-current/50">
          <LockKeyhole />
          Instrument unavailable
        </div>
      </div>
    );
  }

  const tickSize = new Decimal(instrument.tickSize);
  const stepSize = new Decimal(instrument.stepSize);
  const pricePrecision = instrument.pricePrecision;
  const qtyPrecision = instrument.quantityPrecision;

  const handleMarketType = (marketType: string) =>
    setValue("type", marketType as TradingOrderType);

  const onSubmit = async (data: TradeFormValues) => {
    const timeInForce = isLimit ? "GTC" : "IOC";
    const orderPrice = isLimit ? String(data.price) : null;
    const qty = String(data.amount);

    const res = await createOrder({
      symbol: instrument.symbol,
      category: "SPOT",
      side: data.side,
      type: data.type,
      timeInForce,
      qty,
      price: orderPrice ?? undefined,
    });

    if (!res.res.ok) {
      const body = res.body as { error?: string } | null;
      toast.error(body?.error ?? "Failed to create order");
      return;
    }

    revalidateBase();
    revalidateQuote();

    toast.success("Order created");
  };

  return (
    <Form
      className="flex flex-col gap-2 p-2 h-full"
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
    >
      <MarketSelect
        onChange={handleMarketType}
        value={type}
        list={MARKET_TYPES}
      />

      <RadioGroup
        orientation="horizontal"
        className="flex gap-2 text-xs text-white/50 w-full"
        aria-label="Order type"
        onChange={(side) => setValue("side", side as TradingSide)}
        value={side}
      >
        {ORDER_SIDES.map((side) => (
          <Radio
            value={side}
            key={side}
            className={cls(
              "relative flex items-center justify-center w-full cursor-pointer capitalize whitespace-nowrap rounded-sm",
              "py-2 px-3 selected:font-semibold selected:text-white bg-white/5",
              {
                "selected:bg-accent": side === "BUY",
                "selected:bg-red-400": side === "SELL",
              },
            )}
          >
            {side}
          </Radio>
        ))}
      </RadioGroup>

      <div className="flex flex-col gap-3">
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
                formatOptions: { maximumFractionDigits: pricePrecision },
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

        <div className={cls("flex flex-col gap-3")}>
          <Controller
            name="amount"
            control={control}
            rules={{}}
            render={({ field, fieldState }) => (
              <CustomNumericField
                numberFieldProps={{
                  formatOptions: {
                    maximumFractionDigits: qtyPrecision,
                  },
                  step: stepSize.toNumber(),
                  ...field,
                  isInvalid: fieldState.invalid,
                }}
                inputProps={{
                  placeholder: "0.00",
                  autoComplete: "off",
                }}
                label="Amount"
                units={base}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <PercentageButtons
            symbol={instrument.symbol}
            side={side}
            availableBalance={quoteBal.available}
            availableAssets={baseBal.available}
            precision={qtyPrecision}
            isLimit={isLimit}
            limitPrice={price}
            onSelect={(value) =>
              setValue("amount", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 underline decoration-dashed underline-offset-2">
              Avaliable {quote}
            </span>
            <WithSkeleton
              data={{ availableBalance: quoteBal.available }}
              skeleton={<Skeleton className="h-3 w-8" />}
            >
              {({ availableBalance }) => (
                <p className="font-semibold">
                  {formatDecimal(availableBalance, pricePrecision)}
                </p>
              )}
            </WithSkeleton>
          </div>

          <div className="text-xs mt-auto">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 underline decoration-dashed underline-offset-2">
                Available {base}
              </span>
              <WithSkeleton
                data={{ availableAssets: baseBal.available }}
                skeleton={<Skeleton className="h-3 w-8" />}
              >
                {({ availableAssets }) => (
                  <p className="font-semibold">
                    {formatDecimal(availableAssets, qtyPrecision)}
                  </p>
                )}
              </WithSkeleton>
            </div>
          </div>
        </div>

        <Hint
          side={side}
          symbol={instrument.symbol}
          amount={amount}
          isLimit={isLimit}
          currency={quote}
          limitPrice={price}
          availableBalance={quoteBal.available}
          availableAssets={baseBal.available}
        />

        <Button
          type="submit"
          className={cls(
            "px-4 py-3 bg-accent rounded-sm w-full cursor-pointer hover:brightness-150 transition-[filter] text-xs font-bold",
            {
              "bg-accent": side === "BUY",
              "bg-red-400": side === "SELL",
            },
          )}
        >
          {side}
        </Button>
      </div>
    </Form>
  );
}
