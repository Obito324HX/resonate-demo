// Thin wrapper around fetch for talking to the Resonate backend API.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (slug) => request(`/products/${slug}`),
  getCategories: () => request(`/products/categories/all`),
  placeOrder: (data) => request(`/orders`, { method: "POST", body: JSON.stringify(data) }),
  getOrder: (id) => request(`/orders/${id}`),
  trackOrder: (orderId, email) =>
    request(`/orders/track`, { method: "POST", body: JSON.stringify({ orderId, email }) }),

  // Stripe test-mode checkout
  createCheckoutSession: (data) =>
    request(`/checkout/create-session`, { method: "POST", body: JSON.stringify(data) }),
  verifyCheckoutSession: (sessionId) =>
    request(`/checkout/verify-session?session_id=${encodeURIComponent(sessionId)}`),
  cancelCheckoutOrder: (orderId) =>
    request(`/checkout/cancel/${orderId}`, { method: "POST" }),

  // Admin
  login: (email, password) =>
    request(`/auth/login`, { method: "POST", body: JSON.stringify({ email, password }) }),
  adminGetOrders: (token) =>
    request(`/orders`, { headers: { Authorization: `Bearer ${token}` } }),
  adminUpdateOrderStatus: (id, status, token) =>
    request(`/orders/${id}/status`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),
  adminCreateProduct: (data, token) =>
    request(`/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  adminUpdateProduct: (id, data, token) =>
    request(`/products/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
  adminDeleteProduct: (id, token) =>
    request(`/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
