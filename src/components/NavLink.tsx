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
          ? "border-b-2 border-rose-600 pb-1 text-gray-900 dark:text-gray-100"
          : "text-gray-600 transition-colors hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400"
      }
    >
      {children}
    </Link>
  );
}