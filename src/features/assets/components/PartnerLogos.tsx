import Image from "next/image";

export function PartnerLogos() {
  return (
    <ul className="flex justify-between gap-2 w-full overflow-auto">
      <li className="flex justify-center px-5 py-3 w-full rounded-md border border-border/50">
        <Image
          src="/partners/1.svg"
          alt="Partner 1"
          width={120}
          height={16}
          className="h-4 w-auto object-contain"
        />
      </li>
      <li className="flex justify-center px-5 py-3 w-full rounded-md border border-border/50">
        <Image
          src="/partners/2.png"
          alt="Partner 2"
          width={120}
          height={16}
          className="h-4 w-auto object-contain"
        />
      </li>
      <li className="flex justify-center px-5 py-3 w-full rounded-md border border-border/50">
        <Image
          src="/partners/3.svg"
          alt="Partner 3"
          width={120}
          height={16}
          className="h-4 w-auto object-contain"
        />
      </li>
    </ul>
  );
}
