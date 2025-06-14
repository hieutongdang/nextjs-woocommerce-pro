import Link from 'next/link';
import ProductCard from './ProductCard';

interface CategoryProductSectionProps {
  category: { id: string; name: string; slug: string };
  products: any[];
}

export default function CategoryProductSection({ category, products }: CategoryProductSectionProps) {
  return (
    <section className="w-full max-w-[1440px] mx-auto mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{category.name}</h2>
        <Link
          href={`/products/${category.slug}`}
          className="px-4 py-2 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition text-sm"
        >
          View All Products
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            slug={product.slug}
            categorySlug={category.slug}
            image={product.image}
            price={product.price}
            regularPrice={product.regularPrice}
            salePrice={product.salePrice}
          />
        ))}
      </div>
    </section>
  );
} 