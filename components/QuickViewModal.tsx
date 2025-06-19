'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { formatPrice, isOnSale, addProductToCart } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-toastify';
import WishlistButton from './WishlistButton';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
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
  };
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const imageUrl = product.image?.sourceUrl || '/images/placeholder.svg';
  const imageAlt = product.image?.altText || product.name;
  const onSale = isOnSale(product.regularPrice, product.salePrice);

  const handleAddToCart = () => {
    addProductToCart(product, addToCart);
    
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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={onClose}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
                  >
                    <FaTimes className="text-gray-600" size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="space-y-6">
                    <div className="pr-16">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 break-words">{product.name}</h2>
                      <div className="flex items-center gap-2">
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-gray-600">{product.rating}</span>
                          </div>
                        )}
                        {product.reviewCount && (
                          <span className="text-gray-500">({product.reviewCount} đánh giá)</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {onSale ? (
                        <div className="flex items-center gap-3">
                          <p className="text-2xl font-medium text-red-600">{formatPrice(product.salePrice)}</p>
                          <p className="text-lg text-gray-500 line-through">{formatPrice(product.regularPrice)}</p>
                        </div>
                      ) : (
                        <p className="text-2xl font-medium text-gray-900">{formatPrice(product.price)}</p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                      >
                        <FaShoppingCart />
                        Thêm vào giỏ
                      </button>
                      <WishlistButton
                        product={{
                          id: product.id,
                          name: product.name,
                          slug: product.slug,
                          image: imageUrl,
                          price: product.price || '',
                          regularPrice: product.regularPrice || '',
                          salePrice: product.salePrice || '',
                        }}
                        className="p-3 border border-gray-200 rounded-xl"
                        iconSize={20}
                        activeClassName="bg-white text-red-500 border border-red-500 shadow-md"
                        inactiveClassName="bg-white text-gray-600 border border-gray-200 hover:text-red-500 hover:border-red-500"
                      />
                    </div>

                    {product.stockStatus === 'out_of_stock' && (
                      <p className="text-red-600 font-medium">Sản phẩm đã hết hàng</p>
                    )}
                    {product.stockStatus === 'low_stock' && (
                      <p className="text-orange-600 font-medium">Sản phẩm sắp hết hàng</p>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 