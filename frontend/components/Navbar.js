"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="border-b border-black/10 sticky top-0 bg-paper/90 backdrop-blur z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/" className="font-display text-2xl tracking-tight">
          Resonate
        </Link>
        <nav className="flex items-center gap-8 text-sm">
          <Link href="/?category=headphones" className="hover:text-accent transition-colors">
            Headphones
          </Link>
          <Link href="/?category=earbuds" className="hover:text-accent transition-colors">
            Earbuds
          </Link>
          <Link href="/?category=speakers" className="hover:text-accent transition-colors">
            Speakers
          </Link>
          <Link href="/cart" className="relative hover:text-accent transition-colors">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
