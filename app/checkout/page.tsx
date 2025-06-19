"use client";

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';
import { formatPrice } from '@/lib/utils';

// const API_URL = process.env.NEXT_PUBLIC_WC_API_URL + '/orders';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);
    setSubmitted(false);
    setOrderNumber(null);
    setLoading(true);

    // Prepare WooCommerce order data
    const orderData = {
      payment_method: 'cod',
      payment_method_title: 'Cash on Delivery',
      set_paid: false,
      billing: {
        first_name: form.name,
        address_1: form.address,
        email: form.email,
        phone: form.phone,
      },
      shipping: {
        first_name: form.name,
        address_1: form.address,
        phone: form.phone,
      },
      line_items: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setOrderNumber(data.id);
        setSubmitted(true);
        clearCart();
      } else {
        setOrderError(
          typeof data.error === 'string'
            ? data.error
            : data.error?.message || 'Đã có lỗi xảy ra khi đặt hàng.'
        );
      }
    } catch (err: any) {
      setOrderError(
        typeof err === 'string'
          ? err
          : err?.message || 'Đã có lỗi xảy ra khi đặt hàng.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 mx-auto mb-6 bg-secondary/20 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark mb-3">Giỏ hàng trống</h1>
          <p className="text-secondary mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
          <Link 
            href="/san-pham" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">Thanh toán</h1>
          <p className="text-secondary">Hoàn tất đơn hàng của bạn</p>
        </div>

        {/* Success Message - Show when order is successful */}
        {submitted && orderNumber && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border rounded-lg p-8 text-center shadow-sm">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-dark mb-2">🎉 Đặt hàng thành công!</h2>
              <p className="text-secondary mb-1">
                Mã đơn hàng: <span className="font-semibold text-dark">#{orderNumber}</span>
              </p>
              <p className="text-sm text-secondary mb-6">Chúng tôi sẽ liên hệ với bạn sớm nhất có thể</p>
              <Link 
                href="/san-pham" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        )}

        {/* Main Content - Hide when order is successful */}
        {!submitted && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Customer Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-dark mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Thông tin khách hàng
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ và tên của bạn"
                      className="w-full px-3 py-2 border border-secondary/30 rounded-lg bg-white text-dark placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                      className="w-full px-3 py-2 border border-secondary/30 rounded-lg bg-white text-dark placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      disabled={loading}
                    />
                  </div>
                  
                  
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="Nhập số điện thoại của bạn"
                      className="w-full px-3 py-2 border border-secondary/30 rounded-lg bg-white text-dark placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Địa chỉ giao hàng *
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Nhập địa chỉ giao hàng chi tiết..."
                      className="w-full px-3 py-2 border border-secondary/30 rounded-lg bg-white text-dark placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none disabled:opacity-50"
                      disabled={loading}
                    />
                  </div>
                  
                  {/* Payment Method Info */}
                  <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      <span className="font-medium text-dark">Thanh toán khi nhận hàng (COD)</span>
                    </div>
                    <p className="text-sm text-secondary">Bạn sẽ thanh toán bằng tiền mặt khi nhận được sản phẩm.</p>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2 text-white">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Đặt hàng ngay
                      </div>
                    )}
                  </button>
                  
                  {/* Error Message */}
                  {orderError && (
                    <div className="bg-alert/10 border border-alert/20 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-alert flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-alert font-medium text-sm">{orderError}</p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-1 lg:order-2">
              <div className="bg-white border rounded-lg p-6 shadow-sm lg:sticky lg:top-8">
                <h2 className="text-lg font-semibold text-dark mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Đơn hàng của bạn
                </h2>
                
                <div className="space-y-3 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-light rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-dark text-sm leading-tight pr-2">{item.name}</h3>
                        <p className="text-secondary text-xs mt-1">Số lượng: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-dark text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="font-semibold text-dark">Tổng cộng</span>
                    <span className="text-lg font-bold text-primary">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}