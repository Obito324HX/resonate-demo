"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const { items, totalCents, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ customerName: "", customerEmail: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const order = await api.placeOrder({
        ...form,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      clearCart();
      router.push(`/order/${order.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <p className="text-center text-muted py-24">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-2">Checkout</h1>
      <p className="text-muted text-sm mb-8">
        This is a demo store — no real payment is collected. Placing an order will save it to
        the database as it would in a live store.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Full name</label>
          <input
            name="customerName"
            required
            value={form.customerName}
            onChange={handleChange}
            className="w-full border border-black/20 rounded-lg px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="customerEmail"
            required
            value={form.customerEmail}
            onChange={handleChange}
            className="w-full border border-black/20 rounded-lg px-4 py-3"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Shipping address</label>
          <textarea
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            className="w-full border border-black/20 rounded-lg px-4 py-3"
            rows={3}
          />
        </div>

        <div className="flex justify-between items-center pt-4 text-lg">
          <span>Total</span>
          <span>${(totalCents / 100).toFixed(2)}</span>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full text-center">
          {loading ? "Placing order..." : "Place order"}
        </button>
      </form>
    </div>
  );
}
