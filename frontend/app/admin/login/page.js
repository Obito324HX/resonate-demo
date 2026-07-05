"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token } = await api.login(email, password);
      window.localStorage.setItem("resonate_admin_token", token);
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="font-display text-3xl mb-8 text-center">Admin login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-black/20 rounded-lg px-4 py-3"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-black/20 rounded-lg px-4 py-3"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full text-center">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="text-xs text-muted text-center mt-6">
        Demo credentials: admin@resonate.dev / changeme123
      </p>
    </div>
  );
}
