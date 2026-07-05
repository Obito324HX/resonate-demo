import Image from "next/image";
import { api } from "@/lib/api";
import AddToCartForm from "./AddToCartForm";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  let product;

  try {
    product = await api.getProduct(params.slug);
  } catch (e) {
    return <p className="text-center text-red-600">Product not found.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-16">
      <div className="aspect-square bg-white rounded-2xl overflow-hidden relative">
        <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
      </div>

      <div>
        <p className="text-muted text-sm uppercase tracking-wide mb-2">{product.category?.name}</p>
        <h1 className="font-display text-4xl mb-4">{product.name}</h1>
        <p className="text-2xl mb-6">${(product.price / 100).toFixed(2)}</p>
        <p className="text-muted mb-8 leading-relaxed">{product.description}</p>

        {product.stock > 0 ? (
          <AddToCartForm product={product} />
        ) : (
          <p className="text-red-600">Out of stock</p>
        )}

        <p className="text-xs text-muted mt-6">{product.stock} in stock</p>
      </div>
    </div>
  );
}
