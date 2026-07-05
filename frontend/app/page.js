import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }) {
  const category = searchParams?.category;
  let products = [];
  let error = null;

  try {
    products = await api.getProducts(category ? { category } : {});
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

      {error && (
        <p className="text-center text-red-600">
          Could not load products. Is the backend running? ({error})
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {!error && products.length === 0 && (
        <p className="text-center text-muted mt-12">No products found in this category.</p>
      )}
    </div>
  );
}
