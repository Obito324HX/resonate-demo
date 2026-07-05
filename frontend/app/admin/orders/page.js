"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { api } from "@/lib/api";

const STATUSES = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

export default function AdminOrdersPage() {
  const { token, checked, logout } = useAdminAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  async function loadOrders() {
    try {
      const data = await api.adminGetOrders(token);
      setOrders(data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  async function handleStatusChange(id, status) {
    try {
      await api.adminUpdateOrderStatus(id, status, token);
      loadOrders();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!checked || !token) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Orders</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/admin/products" className="underline">
            Manage products
          </Link>
          <button onClick={logout} className="text-muted">
            Log out
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-black/10 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium">{order.customerName}</p>
                <p className="text-sm text-muted">{order.customerEmail}</p>
                <p className="text-xs text-muted mt-1">Order #{order.id}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="border border-black/20 rounded-lg px-3 py-1 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-muted">
              {order.items.map((item) => (
                <p key={item.id}>{item.product.name} × {item.quantity}</p>
              ))}
            </div>
            <p className="mt-2 font-medium">${(order.totalCents / 100).toFixed(2)}</p>
          </div>
        ))}

        {orders.length === 0 && <p className="text-muted">No orders yet.</p>}
      </div>
    </div>
  );
}
