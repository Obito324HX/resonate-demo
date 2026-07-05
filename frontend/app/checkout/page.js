"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutForm />
    </Suspense>
  );
}

function CheckoutForm() {
  const { items, totalCents } = useCart();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ customerName: "", customerEmail: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelledNotice, setCancelledNotice] = useState(false);

  // If Stripe redirected back here after a cancelled payment, restore the
  // stock that was provisionally reserved and let the customer know.
  useEffect(() => {
    const cancelled = searchParams.get("cancelled");
    const orderId = searchParams.get("orderId");
    if (cancelled && orderId) {
      api.cancelCheckoutOrder(orderId).finally(() => setCancelledNotice(true));
    }
  }, [searchParams]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { url } = await api.createCheckoutSession({
        ...form,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });
      // Redirect to Stripe's hosted, test-mode payment page.
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (items.length === 0 && !cancelledNotice) {
    return <p className="text-center text-muted py-24">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display text-3xl mb-2">Checkout</h1>
      <p className="text-muted text-sm mb-2">
        This is a demo store using Stripe&apos;s test mode — you&apos;ll be taken to a real
        Stripe payment page, but no real card or money is involved.
      </p>
      <p className="text-muted text-xs mb-8">
        Use test card <span className="font-mono">4242 4242 4242 4242</span>, any future
        expiry date, any 3-digit CVC, and any postal code.
      </p>

      {cancelledNotice && (
        <p className="text-sm bg-black/5 rounded-lg px-4 py-3 mb-6">
          Checkout was cancelled — your cart has been restored, nothing was charged.
        </p>
      )}

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
          {loading ? "Redirecting to payment..." : "Pay with Stripe (test mode)"}
        </button>
      </form>
    </div>
  );
}
