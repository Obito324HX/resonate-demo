"use client";

import { useState } from "react";
import { api } from "@/lib/api";

const STATUS_LABELS = {
  PENDING: "Order received — awaiting processing",
  PAID: "Payment confirmed",
  SHIPPED: "Shipped",
  CANCELLED: "Cancelled",
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const result = await api.trackOrder(orderId.trim(), email.trim());
      setOrder(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-2">Track your order</h1>
      <p className="text-muted text-sm mb-8">
        Enter your order ID (from your confirmation page) and the email you used at checkout.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          placeholder="Order ID"
          required
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full border border-black/20 rounded-lg px-4 py-3"
        />
        <input
          type="email"
          placeholder="Email used at checkout"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black/20 rounded-lg px-4 py-3"
        />
        <button type="submit" disabled={loading} className="btn-primary w-full text-center">
          {loading ? "Looking up..." : "Track order"}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm text-center">{error}</p>}

      {order && (
        <div className="border border-black/10 rounded-2xl p-6">
          <p className="text-sm text-muted mb-1">Order #{order.id}</p>
          <p className="font-medium mb-4">{STATUS_LABELS[order.status] || order.status}</p>

          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>${((item.priceCents * item.quantity) / 100).toFixed(2)}</span>
            </div>
          ))}

          <div className="flex justify-between font-medium pt-4 border-t border-black/10 mt-4">
            <span>Total</span>
            <span>${(order.totalCents / 100).toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
