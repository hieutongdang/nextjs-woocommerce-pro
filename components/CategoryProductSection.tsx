import Link from 'next/link';
import ProductCard from './ProductCard';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaThLarge,
  FaArrowRight,
  FaSpinner
} from 'react-icons/fa';

interface CategoryProductSectionProps {
  category: { id: string; name: string; slug: string };
  products: any[];
}

export default function CategoryProductSection({ category, products }: CategoryProductSectionProps) {
  return (
    <section className="w-full max-w-[1440px] mx-auto mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase">{category.name}</h2>
        <Link
          href={`/san-pham/${category.slug}`}
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-xl hover:from-primary/20 hover:to-primary/10 transition-all duration-300 font-medium"
        >
          Xem tất cả <FaArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
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