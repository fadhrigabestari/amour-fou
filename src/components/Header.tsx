import Link from "next/link";
import NavLink from "./NavLink";

export default function Header() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2D5016]/20 bg-black/75 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <span className="font-imperial text-2xl font-bold text-white">
              A<span className="text-sm">&</span>F
            </span>
          </Link>
          <div className="flex gap-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/pictures">Pictures</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}