import { Tab } from "react-aria-components";
import { cls } from "@/utils/general.utils";

export const TabButton = (props: {
  id: string;
  label: string;
  count: number;
}) => {
  return (
    <Tab
      id={props.id}
      className={({ isSelected }) =>
        cls(
          "cursor-pointer select-none whitespace-nowrap px-3 py-1.5 rounded-xs text-xs font-semibold transition-colors",
          isSelected
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white hover:bg-white/5",
        )
      }
    >
      <span>{props.label}</span>
      <span className="ml-2 inline-flex min-w-6 justify-center rounded-xs bg-black/20 px-1.5 py-0.5 text-xxs text-white/70">
        {props.count}
      </span>
    </Tab>
  );
};
