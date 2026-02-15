import { Radio, RadioGroup } from "react-aria-components";
import { cls } from "@/utils/general.utils";

export const MarketSelect = ({
  onChange,
  value,
  list,
}: {
  onChange: (value: string) => void;
  value: string;
  list: string[];
}) => {
  return (
    <RadioGroup
      orientation="horizontal"
      className="flex gap-2 my-2 text-xs text-white/50"
      aria-label="Order type"
      onChange={onChange}
      value={value}
    >
      {list.map((type) => (
        <Radio
          value={type}
          key={type}
          className={cls(
            "group relative flex items-center justify-center cursor-pointer",
          )}
        >
          <span
            className={cls(
              "capitalize whitespace-nowrap",
              "group-selected:font-semibold group-selected:text-white",
            )}
          >
            {type}
          </span>
          {type === "LIMIT" && (
            <div className="hidden group-hover:flex absolute z-50 min-w-40 top-full py-0.5 px-1 bg-white text-background mt-2 font-thin">
              Limit orders stay active for up to 7 days or until canceled /
              triggered.
            </div>
          )}
        </Radio>
      ))}
    </RadioGroup>
  );
};
