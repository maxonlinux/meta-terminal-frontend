import { ArrowRight } from "lucide-react";
import { cls } from "@/utils/general.utils";

const DiscoverTrading = () => {
  const red = {
    borderHover: "group-hover:border-red-500",
    shadowHover: "group-hover:shadow-[0px_0px_40px_5px_#e53e3e]",
    bgHover: "group-hover:bg-red-500",
  };

  const blue = {
    borderHover: "group-hover:border-blue-500",
    shadowHover: "group-hover:shadow-[0px_0px_40px_5px_#2b6cb0]",
    bgHover: "group-hover:bg-blue-500",
  };

  const candles = [
    { id: 1, height: "h-40", offset: "mt-0", ...red },
    { id: 2, height: "h-32", offset: "mt-14", ...blue },
    { id: 3, height: "h-60", offset: "mt-5", ...red },
    { id: 4, height: "h-32", offset: "mt-0", ...blue },
    { id: 5, height: "h-32", offset: "mt-14", ...red },
    { id: 6, height: "h-40", offset: "-mt-8", ...blue },
    { id: 7, height: "h-20", offset: "-mt-16", ...blue },
    { id: 8, height: "h-40", offset: "-mt-3", ...red },
    { id: 9, height: "h-20", offset: "-mt-12", ...red },
    { id: 10, height: "h-40", offset: "mt-12", ...red },
  ];

  return (
    <div className="mb-10 mt-16 p-6 size-full">
      <div className="relative size-full mask-r-from-50%">
        <div className="group absolute flex gap-4 py-20 px-6">
          {candles.map((candle) => (
            <div
              key={candle.id}
              className={cls(
                "relative flex items-center bg-background justify-center w-6 rounded-lg border border-white transition-colors",
                candle.height,
                candle.offset,
                candle.bgHover,
                candle.borderHover,
                candle.shadowHover,
              )}
            >
              <div
                className={cls(
                  "absolute -z-10 h-[120%] w-px bg-white group-hover:bg-red-500",
                  candle.bgHover,
                )}
              />
            </div>
          ))}
          <div className="my-auto flex justify-center px-10">
            <ArrowRight size={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverTrading;
