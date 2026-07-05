"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function StoreControls({ initialSearch, initialSort }) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Debounce search input so we don't refetch on every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({ search: search || null });
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function updateParams(updates) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-black/20 rounded-full px-5 py-2 text-sm w-full sm:w-64"
      />
      <select
        defaultValue={initialSort}
        onChange={(e) => updateParams({ sort: e.target.value })}
        className="border border-black/20 rounded-full px-5 py-2 text-sm"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A–Z</option>
      </select>
    </div>
  );
}
