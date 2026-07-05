"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

export default function ClearCartOnSuccess() {
  const { clearCart } = useCart();
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current) {
      clearCart();
      cleared.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
