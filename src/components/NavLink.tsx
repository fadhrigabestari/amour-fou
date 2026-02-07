"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={
        isActive
          ? "border-b-2 border-[#9CAF88] pb-1 text-white font-semibold"
          : "text-white/80 transition-colors hover:text-[#9CAF88]"
      }
    >
      {children}
    </Link>
  );
}