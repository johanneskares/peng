import { Pointer } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Pointer className="size-5 text-primary mr-2 rotate-90" />
              <span className="font-bold text-xl">Peng</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              href="/rules"
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Rules
            </Link>
            <Link
              href="/get-started"
              className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}