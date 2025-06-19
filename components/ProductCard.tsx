'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  FaRegHeart, 
  FaHeart, 
  FaShoppingCart, 
  FaEye,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaFire,
  FaPercent
} from 'react-icons/fa';
import { formatPrice, isOnSale, addProductToCart } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import QuickViewModal from './QuickViewModal';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  image: {
    sourceUrl: string;
    altText: string;
  } | null;
  price: string;
  regularPrice?: string;
  salePrice?: string;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  stockStatus?: 'in_stock' | 'out_of_stock' | 'low_stock';
  galleryImages?: Array<{ sourceUrl: string; altText: string }>;
}

export default function ProductCard({
  id,
  name,
  slug,
  categorySlug,
  image,
  price,
  regularPrice,
  salePrice,
  rating = 4.5,
  reviewCount = 0,
  isNew = false,
  isBestSeller = false,
  stockStatus = 'in_stock',
  galleryImages = [],
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isQuickViewOpen, setQuickViewOpen] = useState(false);

  const onSale = isOnSale(regularPrice, salePrice);
  const imageUrl = image?.sourceUrl || '/images/placeholder.svg';
  const imageAlt = image?.altText || name;
  const href = `/san-pham/${categorySlug}/${slug}`;

  // Calculate discount percentage
  const discountPercentage = onSale && regularPrice && salePrice 
    ? Math.round(((parseFloat(regularPrice) - parseFloat(salePrice)) / parseFloat(regularPrice)) * 100)
    : 0;

  // All images including main image
  const allImages = [
    { sourceUrl: imageUrl, altText: imageAlt },
    ...galleryImages
  ];

  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addProductToCart({
      id,
      name,
      price,
      image
    }, addToCart);

    toast.success('Đã thêm vào giỏ hàng', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
    <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-primary/20 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
        {isNew && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-lg">
            MỚI
          </span>
        )}
        {isBestSeller && (
          <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
            <FaFire size={10} />
            BÁN CHẠY
          </span>
        )}
        {onSale && discountPercentage > 0 && (
          <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full shadow-lg flex items-center gap-1">
            <FaPercent size={8} />
            -{discountPercentage}%
          </span>
        )}
        {stockStatus === 'low_stock' && (
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
            SẮP HẾT
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-20">
        <WishlistButton
          product={{
            id,
            name,
            slug,
            image: imageUrl,
            price: price || '',
            regularPrice: regularPrice || '',
            salePrice: salePrice || '',
          }}
        />
      </div>

      <Link href={href} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Stock overlay */}
          {stockStatus === 'out_of_stock' && (
            <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">HẾT HÀNG</span>
            </div>
          )}

          {/* Image */}
          <div className="relative w-full h-full">
            <Image
              src={allImages[currentImageIndex]?.sourceUrl || imageUrl}
              alt={allImages[currentImageIndex]?.altText || imageAlt}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className={`object-cover object-center transition-all duration-500 ${
                isImageLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'
              } group-hover:scale-105`}
              onLoad={() => setIsImageLoading(false)}
            />
          </div>

          {/* Image indicators */}
          {allImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentImageIndex 
                      ? 'bg-white scale-125' 
                      : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleQuickView}
                className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110"
                title="Xem nhanh"
              >
                <FaEye className="text-gray-700" size={18} />
              </button>
              
              {stockStatus !== 'out_of_stock' && (
                <button
                  onClick={handleAddToCart}
                  className="p-3 bg-primary/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-primary transition-all duration-200 transform hover:scale-110"
                  title="Thêm vào giỏ"
                >
                  <FaShoppingCart className="text-white" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-gray-500">
              ({reviewCount > 0 ? `${reviewCount} đánh giá` : 'Chưa có đánh giá'})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {onSale ? (
                <>
                  <span className="text-xl font-bold text-red-600">
                    {formatPrice(salePrice)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(regularPrice)}
                  </span>
                </>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(price)}
                </span>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                stockStatus === 'in_stock' ? 'bg-green-500' :
                stockStatus === 'low_stock' ? 'bg-orange-500' : 'bg-red-500'
              }`} />
              <span className={`text-xs font-medium ${
                stockStatus === 'in_stock' ? 'text-green-600' :
                stockStatus === 'low_stock' ? 'text-orange-600' : 'text-red-600'
              }`}>
                {stockStatus === 'in_stock' ? 'Còn hàng' :
                 stockStatus === 'low_stock' ? 'Sắp hết' : 'Hết hàng'}
              </span>
            </div>
          </div>

          {/* Quick Add to Cart for mobile */}
          {stockStatus !== 'out_of_stock' && (
            <button
              onClick={handleAddToCart}
              className="w-full mt-3 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors duration-200 md:hidden"
            >
              Thêm vào giỏ
            </button>
          )}
        </div>
      </Link>

      {/* Loading overlay */}
      {isImageLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={{
          id,
          name,
          slug,
          categorySlug,
          image,
          price,
          regularPrice,
          salePrice,
          rating,
          reviewCount,
          isNew,
          isBestSeller,
          stockStatus,
          galleryImages,
        }}
      />
    </>
  );
}