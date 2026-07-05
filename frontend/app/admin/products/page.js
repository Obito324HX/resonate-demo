"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { api } from "@/lib/api";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  imageUrl: "",
  stock: "",
  featured: false,
  categoryId: "",
};

export default function AdminProductsPage() {
  const { token, checked, logout } = useAdminAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  async function loadData() {
    try {
      const [p, c] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(p);
      setCategories(c);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  function handleChange(e) {
    const { name, value, type, checked: isChecked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? isChecked : value });
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      featured: product.featured,
      categoryId: product.categoryId,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };

    try {
      if (editingId) {
        await api.adminUpdateProduct(editingId, payload, token);
      } else {
        await api.adminCreateProduct(payload, token);
      }
      resetForm();
      loadData();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.adminDeleteProduct(id, token);
      loadData();
    } catch (e) {
      setError(e.message);
    }
  }

  if (!checked || !token) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl">Manage products</h1>
        <div className="flex gap-4 text-sm">
          <Link href="/admin/orders" className="underline">
            View orders
          </Link>
          <button onClick={logout} className="text-muted">
            Log out
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 border border-black/10 rounded-2xl p-6 mb-10">
        <input name="name" placeholder="Name" required value={form.name} onChange={handleChange} className="border border-black/20 rounded-lg px-4 py-2" />
        <input name="slug" placeholder="slug-like-this" required value={form.slug} onChange={handleChange} className="border border-black/20 rounded-lg px-4 py-2" />
        <input name="price" type="number" placeholder="Price in cents" required value={form.price} onChange={handleChange} className="border border-black/20 rounded-lg px-4 py-2" />
        <input name="stock" type="number" placeholder="Stock" required value={form.stock} onChange={handleChange} className="border border-black/20 rounded-lg px-4 py-2" />
        <input name="imageUrl" placeholder="/images/product.jpg" required value={form.imageUrl} onChange={handleChange} className="border border-black/20 rounded-lg px-4 py-2" />
        <select name="categoryId" required value={form.categoryId} onChange={handleChange} className="border border-black/20 rounded-lg px-4 py-2">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border border-black/20 rounded-lg px-4 py-2 md:col-span-2" rows={2} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
          Featured
        </label>

        {error && <p className="text-red-600 text-sm md:col-span-2">{error}</p>}

        <div className="md:col-span-2 flex gap-3">
          <button type="submit" className="btn-primary">
            {editingId ? "Update product" : "Add product"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between items-center border-b border-black/10 pb-3">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-muted">${(p.price / 100).toFixed(2)} · stock: {p.stock}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => startEdit(p)} className="underline">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
