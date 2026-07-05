import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="aspect-square bg-white rounded-2xl overflow-hidden mb-4 relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {lowStock && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs px-3 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 left-3 bg-ink text-white text-xs px-3 py-1 rounded-full">
            Out of stock
          </span>
        )}
      </div>
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-muted text-sm">{product.category?.name}</p>
      <p className="mt-1">${(product.price / 100).toFixed(2)}</p>
    </Link>
  );
}
