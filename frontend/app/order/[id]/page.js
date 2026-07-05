import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }) {
  let order;

  try {
    order = await api.getOrder(params.id);
  } catch (e) {
    return <p className="text-center text-red-600">Order not found.</p>;
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="font-display text-3xl mb-2">Thank you, {order.customerName.split(" ")[0]}!</h1>
      <p className="text-muted mb-8">Your order has been placed.</p>

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

      <Link href="/" className="btn-primary">
        Continue shopping
      </Link>
    </div>
  );
}
