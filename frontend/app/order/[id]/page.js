import Link from "next/link";
import { api } from "@/lib/api";
import ClearCartOnSuccess from "./ClearCartOnSuccess";

export const dynamic = "force-dynamic";

const STATUS_LABELS = {
  PENDING: "Awaiting payment",
  PAID: "Payment confirmed",
  SHIPPED: "Shipped",
  CANCELLED: "Cancelled",
};

export default async function OrderConfirmationPage({ params, searchParams }) {
  const sessionId = searchParams?.session_id;
  let order;

  try {
    // If we came here straight from Stripe, verify the payment server-side
    // before trusting the order is actually paid.
    if (sessionId) {
      await api.verifyCheckoutSession(sessionId);
    }
    order = await api.getOrder(params.id);
  } catch (e) {
    return <p className="text-center text-red-600">Order not found.</p>;
  }

  const paid = order.status === "PAID" || order.status === "SHIPPED";

  return (
    <div className="max-w-md mx-auto text-center">
      {sessionId && paid && <ClearCartOnSuccess />}

      <h1 className="font-display text-3xl mb-2">
        {paid ? `Thank you, ${order.customerName.split(" ")[0]}!` : "Order received"}
      </h1>
      <p className="text-muted mb-2">
        {paid ? "Your payment was successful." : "Waiting for payment confirmation."}
      </p>
      <p className="text-xs inline-block bg-black/5 rounded-full px-3 py-1 mb-8">
        {STATUS_LABELS[order.status] || order.status}
      </p>

      <div className="text-left border border-black/10 rounded-2xl p-6 mb-8">
        <p className="text-sm text-muted mb-4">Order #{order.id}</p>
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

      <p className="text-xs text-muted mb-6">
        Save your order ID above — you can use it with your email on the{" "}
        <Link href="/track" className="underline">
          Track order
        </Link>{" "}
        page any time.
      </p>

      <Link href="/" className="btn-primary">
        Continue shopping
      </Link>
    </div>
  );
}
