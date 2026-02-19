import {
  BanknoteArrowUp,
  CheckCircle,
  Copy,
  Info,
  LoaderCircle,
  X,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import { OverlayProvider } from "react-aria";
import {
  Button,
  Dialog,
  DialogTrigger,
  Form,
  Group,
  Heading,
  type Key,
  Label,
  ListBoxItem,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import useSWR from "swr";
import { Skeleton } from "@/components/common/Skeleton";
import { WithSkeleton } from "@/components/common/WithSkeleton";
import { CustomNumericField } from "@/components/ui/CustomNumericField";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { useUserTransactions } from "@/features/user/hooks/useUserTransactions";
import type { Wallet } from "@/features/user/types";
import { cls } from "@/utils/general.utils";
import { PartnerLogos } from "./PartnerLogos";
import { fetchWallets } from "@/api/wallets";

const AMOUNTS = [500, 1000, 2000, 5000];

const MODAL_NAME = "deposit";

type FormValues = {
  walletId: number | undefined;
  amount: number | undefined;
};

const AddressBox = ({
  walletId,
  wallets,
  ...rest
}: {
  wallets: Wallet[];
  walletId: Key;
} & Omit<React.ComponentProps<typeof CustomSelect>, "items" | "children">) => {
  const wallet = wallets.find((item) => item.id === Number(walletId));
  const address = wallet?.address ?? "";
  return (
    <div className="relative flex flex-col w-full border border-border rounded-sm overflow-hidden">
      <div className="flex items-center gap-2 w-full bg-neutral-900 p-2">
        <Button
          className="text-current/50 hover:text-white cursor-pointer"
          onClick={() => {
            void toast.promise(
              navigator.clipboard.writeText(address.toString()),
              {
                loading: "Copying...",
                success: "Address copied to clipboard",
                error: "Failed to copy",
              },
            );
          }}
        >
          <Copy size={12} />
        </Button>

        <Label className={cls("text-xs text-current/50")}>
          Your unique replenishment address
        </Label>

        <CustomSelect {...rest} items={wallets}>
          {(item) => (
            <ListBoxItem
              key={item.id}
              id={item.id}
              className="p-2 text-xs focus:bg-neutral-900 focus:cursor-pointer focus:text-white"
              textValue={item.network}
            >
              <span className="">
                {item.network} ({item.currency})
              </span>
            </ListBoxItem>
          )}
        </CustomSelect>
      </div>
      <div className="relative wrap-anywhere text-sm p-2">{address}</div>
    </div>
  );
};

export default function DepositModal(params: { showTrigger: boolean }) {
  const { createDepositTransaction } = useUserTransactions();

  const [modalName, setModalName] = useQueryState("modal");
  const open = () => {
    void setModalName(MODAL_NAME);
  };
  const close = () => {
    void setModalName(null);
  };
  const isOpen = modalName === MODAL_NAME;

  const modalRef = useRef<HTMLDivElement>(null);

  const { data: wallets } = useSWR<Wallet[]>("user:wallets", fetchWallets);

  const { control, handleSubmit, watch, trigger, reset, setValue, formState } =
    useForm<FormValues>({
      mode: "onBlur",
      defaultValues: {
        walletId: undefined,
        amount: undefined,
      },
    });

  const walletId = watch("walletId");
  const amount = watch("amount");
  const address = wallets?.find((x) => x.id === walletId)?.address ?? "";

  useEffect(() => {
    if (!wallets?.length) return;
    if (walletId) return;
    reset({ walletId: wallets[0].id, amount: undefined });
  }, [walletId, reset, wallets]);

  const currency = wallets?.find((x) => x.id === walletId)?.currency ?? "";

  const onSubmit = async (data: FormValues) => {
    if (!(data.amount && data.walletId)) return;

    try {
      if (!currency) throw new Error("Currency not selected");
      const res = await createDepositTransaction({
        walletId: data.walletId,
        amount: data.amount,
      });
      if (!res) {
        toast.error("Error creating deposit request");
        return;
      }
      toast.success("Deposit request created");
    } finally {
      close();
    }
  };

  useEffect(() => {
    if (amount) void trigger("amount");
  }, [amount, trigger]);

  return (
    <DialogTrigger
      isOpen={isOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close();
        }
      }}
    >
      <Button
        onClick={open}
        className={cls(
          "flex items-center gap-2 text-left text-xs rounded-sm px-3 py-2 font-semibold cursor-pointer",
          params.showTrigger
            ? "bg-accent text-white hover:brightness-110"
            : "hidden",
        )}
      >
        <BanknoteArrowUp size={16} />
        <span>Deposit</span>
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
            ref={modalRef}
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
                    DEPOSIT
                    <Button className="cursor-pointer" onClick={close}>
                      <X />
                    </Button>
                  </Heading>

                  <div className="flex flex-col gap-4 p-4">
                    <div className="relative flex p-4 items-center justify-center">
                      <WithSkeleton
                        data={{ address }}
                        skeleton={<Skeleton className="size-37.5 rounded-sm" />}
                      >
                        {({ address }) => (
                          <QRCode
                            value={address.toString()}
                            size={150}
                            level="H"
                            bgColor="transparent"
                            className="p-1.5 rounded-sm bg-white border border-border aspect-square shrink-0"
                          />
                        )}
                      </WithSkeleton>
                    </div>

                    <Form
                      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                      className="flex flex-col gap-4"
                    >
                      <Controller
                        name="amount"
                        control={control}
                        rules={{
                          required: "Amount is required",
                          min: {
                            value: 10,
                            message: `Deposit can't be less than 10 ${currency}`,
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <CustomNumericField
                            label="Amount"
                            isVisualRequired
                            numberFieldProps={{
                              ...field,
                              isInvalid: fieldState.invalid,
                              minValue: 0.01,
                            }}
                            inputProps={{
                              placeholder: "0.00",
                            }}
                            units={currency}
                            errorMessage={fieldState.error?.message}
                          />
                        )}
                      />

                      <Group
                        aria-label="Amount buttons"
                        className="flex justify-end gap-2 font-medium text-blue-500 text-sm"
                      >
                        {AMOUNTS.map((amount) => (
                          <WithSkeleton
                            key={amount}
                            data={{ currency }}
                            skeleton={
                              <Skeleton className="h-3 w-16 rounded-sm" />
                            }
                          >
                            {({ currency }) => (
                              <Button
                                className="hover:underline text-xs cursor-pointer"
                                onClick={() =>
                                  setValue("amount", amount, {
                                    shouldValidate: true,
                                  })
                                }
                              >
                                {amount} {currency}
                              </Button>
                            )}
                          </WithSkeleton>
                        ))}
                      </Group>

                      <WithSkeleton
                        data={{ walletId, wallets }}
                        skeleton={
                          <Skeleton className="h-16.5 w-full rounded-sm" />
                        }
                      >
                        {({ walletId, wallets }) => (
                          <Controller
                            name="walletId"
                            control={control}
                            rules={{
                              required: "Wallet is required",
                            }}
                            render={({ field }) => (
                              <AddressBox
                                wallets={wallets}
                                walletId={walletId}
                                selectProps={{
                                  ...field,
                                  "aria-label": "Address select",
                                  onSelectionChange: (key) =>
                                    field.onChange(Number(key)),
                                  selectedKey: walletId,
                                }}
                              />
                            )}
                          />
                        )}
                      </WithSkeleton>

                      <div className="p-4 rounded-sm text-xs bg-blue-500/10 border border-accent/10">
                        <Info className="inline text-blue-500 mr-2" size={16} />
                        After making the payment, press the &apos;Payment
                        posted&apos; button. If you want to cancel the payment,
                        press &apos;Cancel&apos;.
                      </div>

                      <WithSkeleton
                        data={{ address }}
                        skeleton={
                          <div className="flex gap-3 @max-xs:flex-col">
                            <Skeleton className="h-12.5 w-full rounded-sm" />
                            <Skeleton className="h-12.5 w-1/3 rounded-sm" />
                          </div>
                        }
                      >
                        {() => (
                          <div className="flex gap-3 @max-xs:flex-col">
                            <Button
                              type="submit"
                              isDisabled={formState.isSubmitting}
                              className="flex items-center gap-3 pl-3 pr-5 py-3 border border-border rounded-sm w-full cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                            >
                              {formState.isSubmitting ? (
                                <LoaderCircle
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                              Payment posted
                            </Button>
                            <Button
                              type="reset"
                              onClick={close}
                              className="flex items-center gap-3 pl-3 pr-5 py-3 rounded-sm text-red-400 border border-red-400/20 cursor-pointer"
                            >
                              <X size={16} />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </WithSkeleton>
                    </Form>
                  </div>

                  <div className="flex flex-col gap-4 p-4">
                    <WithSkeleton
                      data={{ currency }}
                      skeleton={<Skeleton className="h-3 w-full rounded-sm" />}
                    >
                      {({ currency }) => (
                        <small className="inline-block text-current/50 text-xs">
                          If you do not have {currency}, you can purchase it
                          from our partners
                        </small>
                      )}
                    </WithSkeleton>

                    <PartnerLogos />
                  </div>
                </>
              )}
            </Dialog>
          </Modal>
        </ModalOverlay>
      </OverlayProvider>
    </DialogTrigger>
  );
}
