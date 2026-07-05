"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function AddToCartForm({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  function handleAdd() {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex items-center gap-4">
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border border-black/20 rounded-full px-4 py-3 text-sm"
      >
        {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <button onClick={handleAdd} className="btn-primary">
        {added ? "Added ✓" : "Add to cart"}
      </button>
      <button onClick={() => router.push("/cart")} className="btn-secondary">
        View cart
      </button>
    </div>
  );
}
