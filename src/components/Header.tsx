import Image from "next/image";
import Link from "next/link";
import NavLink from "./NavLink";

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 border-b border-rose-200 bg-white/80 backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/globe.svg"
              alt="Amour Fou"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div className="flex gap-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/pictures">Pictures</NavLink>
            <NavLink href="/story">Our Story</NavLink>
            <NavLink href="/details">Details</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}