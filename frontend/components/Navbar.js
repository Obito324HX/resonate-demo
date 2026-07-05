"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/?category=headphones", label: "Headphones" },
    { href: "/?category=earbuds", label: "Earbuds" },
    { href: "/?category=speakers", label: "Speakers" },
    { href: "/track", label: "Track order" },
  ];

  return (
    <header className="border-b border-black/10 sticky top-0 bg-paper/90 backdrop-blur z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight"
          onClick={() => setMenuOpen(false)}
        >
          Resonate
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-accent transition-colors">
              {link.label}
            </Link>
          ))}
          <Link href="/cart" className="relative hover:text-accent transition-colors">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile controls: cart + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative" onClick={() => setMenuOpen(false)}>
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          >
            <span
              className={`block w-6 h-0.5 bg-ink transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span className={`block w-6 h-0.5 bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span
              className={`block w-6 h-0.5 bg-ink transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-black/10 bg-paper px-6 py-4 flex flex-col gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-accent transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
