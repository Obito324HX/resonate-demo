import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import StoreControls from "@/components/StoreControls";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const category = searchParams?.category || "";
  const search = searchParams?.search || "";
  const sort = searchParams?.sort || "newest";

  let products = [];
  let error = null;

  try {
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    products = await api.getProducts(params);
  } catch (e) {
    error = e.message;
  }

  return (
    <div>
      <section className="mb-16 text-center py-16">
        <h1 className="font-display text-5xl mb-4">Sound, refined.</h1>
        <p className="text-muted max-w-md mx-auto">
          Headphones, earbuds, and speakers designed for people who actually listen.
        </p>
      </section>

      <StoreControls initialSearch={search} initialSort={sort} category={category} />

      {error && (
        <p className="text-center text-red-600 mt-8">
          Could not load products. Is the backend running? ({error})
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {!error && products.length === 0 && (
        <p className="text-center text-muted mt-12">No products found.</p>
      )}
    </div>
  );
}
