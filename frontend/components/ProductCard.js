import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
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
      </div>
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-muted text-sm">{product.category?.name}</p>
      <p className="mt-1">${(product.price / 100).toFixed(2)}</p>
    </Link>
  );
}
