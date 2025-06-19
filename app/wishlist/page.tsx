'use client';

import { useEffect, useState } from 'react';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded shadow p-4 h-64 flex flex-col gap-2">
      <div className="bg-gray-200 h-32 w-full rounded mb-2" />
      <div className="bg-gray-200 h-4 w-3/4 rounded" />
      <div className="bg-gray-200 h-3 w-1/2 rounded" />
      <div className="bg-gray-200 h-3 w-1/3 rounded" />
    </div>
  );
}

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async loading for first mount
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Danh sách yêu thích</h1>
        <span className="text-gray-600">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'sản phẩm' : 'sản phẩm'}
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <FaHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Danh sách yêu thích trống</h1>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
          </div>
          <Link 
            href="/san-pham" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            <FaShoppingCart />
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {wishlistItems.map((item) => (
            <ProductCard
              key={item.id}
              id={item.id}
              name={item.name}
              slug={item.slug}
              categorySlug="wishlist"
              image={{
                sourceUrl: item.image,
                altText: item.name
              }}
              price={item.price}
              regularPrice={item.regularPrice}
              salePrice={item.salePrice}
              rating={item.rating}
              reviewCount={item.reviewCount}
              isNew={item.isNew}
              isBestSeller={item.isBestSeller}
              stockStatus={item.stockStatus}
              galleryImages={item.galleryImages}
            />
          ))}
        </div>
      )}
    </div>
  );
} 