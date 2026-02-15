"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({
  children,
  href,
  className,
  ...rest
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
} & React.ComponentProps<typeof Link>) => {
  const pathname = usePathname();

  const isActive =
    pathname.endsWith(href) || (pathname.includes(href) && pathname !== "/");

  return (
    <Link
      data-active={isActive || undefined}
      className={className}
      href={href}
      {...rest}
    >
      {children}
    </Link>
  );
};
export default NavLink;
