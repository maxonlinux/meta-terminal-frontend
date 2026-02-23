"use client";

import {
  Check,
  CircleArrowDown,
  CircleArrowUp,
  CircleDashed,
  X,
} from "lucide-react";
import { Button, Dialog, DialogTrigger, Popover } from "react-aria-components";
import type {
  FundingRequest,
  FundingStatus,
  FundingType,
} from "@/features/user/types";
import { formatTimestamp } from "@/lib/time";
import { cls } from "@/utils/general.utils";

type Element = {
  label: string;
  icon: React.ElementType;
  color: string;
};

const fundingStatuses: Record<FundingStatus, Element> = {
  PENDING: {
    label: "Pending",
    icon: CircleDashed,
    color: "text-gray-500",
  },
  COMPLETED: {
    label: "Approved",
    icon: Check,
    color: "text-green-500",
  },
  CANCELED: {
    label: "Canceled",
    icon: X,
    color: "text-red-400",
  },
};

const fundingTypes: Record<FundingType, Element> = {
  DEPOSIT: {
    label: "Replenishment",
    icon: CircleArrowDown,
    color: "text-green-500",
  },
  WITHDRAWAL: {
    label: "Withdrawal",
    icon: CircleArrowUp,
    color: "text-red-400",
  },
};

function TransactionRow({ transaction }: { transaction: FundingRequest }) {
  const StatusIcon = fundingStatuses[transaction.status].icon;
  const TypeIcon = fundingTypes[transaction.type].icon;

  const formatted = formatTimestamp(transaction.createdAt);
  const [datePart, timePart] =
    formatted === "--" ? ["--", "--"] : formatted.split(" ");

  return (
    <tr>
      <td className="rext-left pl-4 pr-1 max-md:pr-1 text-xxs text-gray-500">
        <span className="whitespace-nowrap">{datePart}</span>
        <br />
        <span className="whitespace-nowrap">{timePart ?? "--"}</span>
      </td>
      <td className="text-left px-1">
        <div
          className={cls("flex items-center gap-2", "@max-sm:justify-center")}
        >
          <span className={cls(fundingTypes[transaction.type].color)}>
            <TypeIcon className="size-3" />
          </span>
          <span className="@max-sm:hidden">
            {fundingTypes[transaction.type].label}
          </span>
        </div>
      </td>
      <td className="text-left px-1">{transaction.amount}</td>
      <td className="text-right px-1 whitespace-nowrap">
        <div
          className={cls("flex items-center gap-2", "@max-sm:justify-center")}
        >
          <span className="@max-sm:hidden">
            {fundingStatuses[transaction.status].label}
          </span>
          <span className={fundingStatuses[transaction.status].color}>
            <StatusIcon className="size-3" />
          </span>
        </div>
      </td>
      <td className="text-right pl-1 pr-4 max-w-25 truncate">
        {transaction.message ? (
          <DialogTrigger>
            <Button className="cursor-pointer text-blue-500 hover:underline pressed:underline">
              Show
            </Button>
            <Popover className="bg-background p-2 border border-border shadow-lg shadow-black max-w-xs">
              <Dialog className="text-xs">
                <div className="flex-col">{transaction.message}</div>
              </Dialog>
            </Popover>
          </DialogTrigger>
        ) : (
          <span className="text-current/50">--</span>
        )}
      </td>
    </tr>
  );
}
export default TransactionRow;
