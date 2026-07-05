"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalCents } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-muted mb-6">Your cart is empty.</p>
        <Link href="/" className="btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl mb-8">Your cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 border-b border-black/10 pb-6">
            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden relative shrink-0">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-muted text-sm">${(item.price / 100).toFixed(2)}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
              className="w-16 border border-black/20 rounded-full px-3 py-2 text-sm text-center"
            />
            <button
              onClick={() => removeItem(item.productId)}
              className="text-muted hover:text-red-600 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8 text-lg">
        <span>Total</span>
        <span>${(totalCents / 100).toFixed(2)}</span>
      </div>

      <div className="mt-8 text-right">
        <Link href="/checkout" className="btn-primary">
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
