'use client';

import { useEffect, useState } from 'react';
import { client } from '@/lib/apollo-client';
import { GET_TOP_CATEGORIES } from '@/lib/graphql/queries';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: any[];
  title: string;
  categorySlug: string;
  className?: string;
}

export default function ProductGrid({ products, title, categorySlug, className = '' }: ProductGridProps) {
  return (
    <section className={`w-full max-w-[1440px] mx-auto mb-12 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            name={product.name}
            slug={product.slug}
            categorySlug={categorySlug}
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