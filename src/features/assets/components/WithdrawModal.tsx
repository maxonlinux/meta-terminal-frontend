import {
  AlertTriangle,
  BanknoteArrowDown,
  CheckCircle,
  LoaderCircle,
  X,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { OverlayProvider } from "react-aria";
import {
  Button,
  Dialog,
  DialogTrigger,
  Form,
  Heading,
  ListBoxItem,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { ApiError } from "@/api/http";
import { CustomNumericField } from "@/components/ui/CustomNumericField";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { CustomTextField } from "@/components/ui/CustomTextField";
import { useUserTransactions } from "@/features/user/hooks/useUserTransactions";
import { cls } from "@/utils/general.utils";
import { PartnerLogos } from "./PartnerLogos";

const MODAL_NAME = "withdrawal";

const NETWORKS = [
  {
    name: "TRC-20",
    currency: "USDT",
    validationRegex: /^T[a-zA-Z0-9]{33}$/,
  },
  {
    name: "ERC-20",
    currency: "USDC",
    validationRegex: /^0x[a-fA-F0-9]{40}$/,
  },
] as const;

const DEFAULT_NETWORK = NETWORKS[0].name;

type FormValues = {
  address: string;
  amount: number | undefined;
};

export default function WithdrawModal(params: { showTrigger: boolean }) {
  const { createWithdrawalTransaction } = useUserTransactions();

  const [modalName, setModalName] = useQueryState("modal");
  const open = () => {
    void setModalName(MODAL_NAME);
  };
  const close = () => {
    void setModalName(null);
  };
  const isOpen = modalName === MODAL_NAME;

  const modalRef = useRef<HTMLDivElement>(null);

  const { control, handleSubmit, trigger, formState } = useForm<FormValues>({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues: {
      amount: undefined,
      address: "",
    },
  });

  const [network, setNetwork] =
    useState<(typeof NETWORKS)[number]["name"]>(DEFAULT_NETWORK);
  const selectedNetwork = NETWORKS.find((x) => x.name === network);

  useEffect(() => {
    // Re-validate address when network changes (regex differs per network).
    if (!network) return;
    void trigger("address");
  }, [trigger, network]);

  // will never happen unless corrupted
  if (!selectedNetwork) {
    throw new Error("Invalid network");
  }

  const currency = selectedNetwork.currency;

  const onSubmit = async (data: FormValues) => {
    if (!data.amount) return;

    try {
      const promise = createWithdrawalTransaction({
        asset: currency,
        amount: data.amount,
        destination: data.address,
      });
      void toast.promise(promise, {
        loading: "Processing...",
        success: () => "Withdrawal request created",
        error: (err) =>
          err instanceof ApiError
            ? err.code
            : "Failed to create withdrawal request",
      });
      await promise;
    } finally {
      close();
    }
  };

  const addressLabel = "Your wallet address";
  const amountLabel = "Withdrawal amount";

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
            ? "border border-white/10 text-white/80 hover:text-white hover:border-white/20"
            : "hidden",
        )}
      >
        <BanknoteArrowDown size={16} />
        <span>Withdraw</span>
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
                    WITHDRAW
                    <Button className="cursor-pointer" onClick={close}>
                      <X />
                    </Button>
                  </Heading>

                  <Form
                    onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                    className="flex flex-col gap-4 p-4"
                  >
                    <Controller
                      name="amount"
                      control={control}
                      rules={{
                        required: "Amount is required",
                        validate: (val) => {
                          if (!val || val < 0.01) {
                            return "Amount must be greater than 0.01";
                          }
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <CustomNumericField
                          label={amountLabel}
                          numberFieldProps={{
                            ...field,
                            isInvalid: fieldState.invalid,
                            minValue: 0.01,
                          }}
                          inputProps={{
                            placeholder: "0.00",
                          }}
                          isVisualRequired
                          errorMessage={fieldState.error?.message}
                          units={currency}
                        />
                      )}
                    />

                    <Controller
                      name="address"
                      control={control}
                      rules={{
                        required: "Address is required",
                        validate: (val) => {
                          if (!selectedNetwork.validationRegex.test(val)) {
                            return `Please enter valid ${selectedNetwork.name} address`;
                          }
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <CustomTextField
                          label={addressLabel}
                          textFieldProps={{
                            ...field,
                            isInvalid: fieldState.invalid,
                          }}
                          isVisualRequired
                          errorMessage={fieldState.error?.message}
                        />
                      )}
                    />

                    <CustomSelect
                      selectProps={{
                        placeholder: "Select network",
                        defaultSelectedKey: DEFAULT_NETWORK,
                        onSelectionChange: (key) => {
                          if (typeof key === "string") {
                            setNetwork(
                              key as (typeof NETWORKS)[number]["name"],
                            );
                          }
                        },
                      }}
                      items={NETWORKS}
                    >
                      {(item) => (
                        <ListBoxItem
                          key={item.name}
                          id={item.name}
                          className="p-2 text-xs focus:bg-neutral-900 focus:cursor-pointer focus:text-white"
                          textValue={item.name}
                        >
                          <span className="">
                            {item.name} ({item.currency})
                          </span>
                        </ListBoxItem>
                      )}
                    </CustomSelect>

                    <div className="p-4 rounded-sm text-xs bg-red-500/10 border border-red-500/10">
                      <AlertTriangle
                        className="inline text-red-500 mr-2"
                        size={16}
                      />
                      Carefully enter the wallet address. Funds sent to an
                      incorrect address are non-refundable!
                    </div>

                    <div className="flex gap-1 flex-col">
                      <Button
                        type="submit"
                        isDisabled={formState.isSubmitting}
                        className="flex items-center gap-3 pl-3 pr-5 py-3 border border-border rounded-sm w-full cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {formState.isSubmitting ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        Withdraw funds
                      </Button>
                      <small className="px-2 py-2 text-xs text-current/50">
                        * TRC-20 network fee (1-3 USD) + commission according to
                        your plan (tier)
                      </small>
                    </div>
                  </Form>

                  <div className="flex flex-col gap-4 p-4">
                    <small className="inline-block text-current/50 text-xs">
                      If you do not have a wallet yet, you can register it with
                      our partners
                    </small>

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
