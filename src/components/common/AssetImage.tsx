import Image from "next/image";

export default function AssetImage({
  symbol,
  imageUrl,
  size,
}: {
  symbol: string;
  imageUrl?: string | null;
  size: number;
}) {
  const classes = [
    "bg-gray-400/20",
    "bg-pink-400/20",
    "bg-blue-400/20",
    "bg-purple-400/20",
    "bg-amber-400/20",
    "bg-orange-400/20",
    "bg-green-400/20",
    "bg-red-400/20",
  ];

  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0;
  }
  const classIndex = hash % classes.length;

  const character = symbol ? symbol[0] : "*";

  return (
    <div
      style={{ height: `${size}px`, width: `${size}px` }}
      className={`flex items-center justify-center shrink-0 rounded-full font-bold overflow-hidden ${classes[classIndex]}`}
    >
      {imageUrl ? (
        <Image
          src={`/proxy/core/storage/${imageUrl}`}
          alt={symbol}
          width={size}
          height={size}
          className="h-full w-full"
          unoptimized
        />
      ) : (
        <span className="text-white" style={{ fontSize: `${size / 2}px` }}>
          {character}
        </span>
      )}
    </div>
  );
}
