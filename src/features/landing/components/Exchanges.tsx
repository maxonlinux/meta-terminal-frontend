import Image from "next/image";
import { Marquee } from "@/components/common/Marquee";
import { cls } from "@/utils/general.utils";

const exchanges = [
  {
    name: "Binance",
    body: "Binance is the world's largest cryptocurrency exchange by trading volume, offering a wide range of digital assets and advanced trading features.",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg",
  },
  {
    name: "Bybit",
    body: "Bybit is a leading derivatives exchange known for its perpetual contracts and innovative trading tools, attracting traders worldwide.",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/14/Bybit_Logo.svg",
  },
  {
    name: "Huobi",
    body: "Huobi is a global digital asset exchange offering spot and derivatives trading, staking, and various financial services to its users.",
    img: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Huobi-logo.png",
  },
  {
    name: "NASDAQ",
    body: "NASDAQ is a major American stock exchange known for its tech-heavy listings and innovative trading technology.",
    img: "https://upload.wikimedia.org/wikipedia/commons/8/87/NASDAQ_Logo.svg",
  },
  {
    name: "Deribit",
    body: "Deribit is a leading cryptocurrency derivatives exchange, known for its Bitcoin and Ethereum futures and options trading.",
    img: "https://www.amberdata.io/hs-fs/hubfs/2560px-Deribit_Company_Logo.png?width=480&name=2560px-Deribit_Company_Logo.png",
  },
  {
    name: "OKX",
    body: "OKX is a global cryptocurrency exchange that provides a comprehensive suite of trading, staking, and DeFi services for digital assets.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/OKX_logo.svg/1116px-OKX_logo.svg.png",
  },
];

const firstRow = exchanges.slice(0, exchanges.length / 2);
const secondRow = exchanges.slice(exchanges.length / 2);

const ExchangeCard = ({
  img,
  name,
  body,
}: {
  img: string;
  name: string;
  body: string;
}) => {
  return (
    <figure
      className={cls(
        "flex flex-col gap-2 relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-50/10 hover:bg-gray-50/15",
      )}
    >
      <div>
        <Image
          className="w-auto h-6 filter invert brightness-0"
          alt={name}
          src={img}
          width={120}
          height={24}
          sizes="120px"
        />
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const Exchanges = () => {
  return (
    <div className="relative overflow-hidden flex flex-col gap-10 w-full my-32">
      <div className="px-8 max-md:px-4">
        <h3 className="font-bold w-full leading-none text-center">
          <span className="text-3xl max-sm:text-[6vw]">We work with</span>
          <br />
          <span
            className="inline-block text-7xl max-sm:text-[8vw] pb-2 align-top bg-clip-text text-transparent bg-linear-to-r from-accent to-green-400"
            style={{
              WebkitBackgroundClip: "text",
            }}
          >
            the largest exchanges
          </span>
        </h3>
      </div>

      <div className="h-96">
        <div className="absolute w-full">
          <Marquee pauseOnHover className="[--duration:20s] mask-x-from-75%">
            {firstRow.map((exchange) => (
              <ExchangeCard key={exchange.name} {...exchange} />
            ))}
          </Marquee>
          <Marquee
            reverse
            pauseOnHover
            className="[--duration:20s] mask-x-from-75%"
          >
            {secondRow.map((exchange) => (
              <ExchangeCard key={exchange.name} {...exchange} />
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
};

export default Exchanges;
