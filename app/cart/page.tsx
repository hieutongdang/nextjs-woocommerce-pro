'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { formatPrice } from '@/lib/utils';
import { toast } from 'react-toastify';

function SkeletonCartItem() {
  return (
    <div className="animate-pulse flex gap-4 bg-white p-4 rounded-xl border border-gray-100">
      <div className="bg-gray-200 w-24 h-24 rounded-lg" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="bg-gray-200 h-5 w-1/2 rounded" />
        <div className="bg-gray-200 h-4 w-1/3 rounded" />
        <div className="bg-gray-200 h-4 w-1/4 rounded" />
      </div>
      <div className="bg-gray-200 w-8 h-8 rounded-full" />
    </div>
  );
}

function SkeletonOrderSummary() {
  return (
    <div className="animate-pulse bg-white p-6 rounded-xl border border-gray-100 flex flex-col gap-4">
      <div className="bg-gray-200 h-6 w-1/2 rounded mb-2" />
      <div className="bg-gray-200 h-4 w-full rounded" />
      <div className="bg-gray-200 h-4 w-3/4 rounded" />
      <div className="bg-gray-200 h-4 w-1/2 rounded" />
      <div className="bg-gray-200 h-10 w-full rounded mt-4" />
      <div className="bg-gray-200 h-10 w-full rounded" />
    </div>
  );
}

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async loading for first mount
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Skeletons */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCartItem key={i} />)}
          </div>
          {/* Order Summary Skeleton */}
          <div className="lg:col-span-1">
            <SkeletonOrderSummary />
          </div>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <FaShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy tiếp tục mua sắm và thêm sản phẩm vào giỏ hàng của bạn.</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border border-gray-100">
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-primary font-medium mb-2">{formatPrice(item.price)}</p>
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaMinus size={12} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    toast.success('Đã xóa sản phẩm khỏi giỏ hàng', {
                      position: "top-right",
                      autoClose: 2000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            ))}
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tổng đơn hàng</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/checkout"
                  className="w-full block text-center py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Thanh toán
                </Link>
                <Link
                  href="/san-pham"
                  className="w-full block text-center py-3 border border-gray-300 text-gray-600 rounded-xl hover:text-primary hover:border-primary transition-colors"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 