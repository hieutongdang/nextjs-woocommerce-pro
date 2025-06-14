'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaRegHeart, FaRegUser, FaShoppingCart, FaRegListAlt, FaSearch } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-2 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <img
            src="/mock/logo.png"
            alt="Saigondoor Logo"
            className="h-10"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/images/placeholder.svg';
            }}
          />
          
        </Link>

        {/* Category Dropdown (placeholder) */}
        <div className="hidden lg:flex items-center relative">
          <button className="flex items-center px-4 py-2 bg-primary/10 text-primary rounded-l-md border border-primary/20 font-medium">
            <FaRegListAlt className="mr-2" />
            All Categories
          </button>
        </div>

        {/* Search Bar */}
        <form className="flex flex-1 max-w-xl mx-4">
          <input
            type="text"
            placeholder="Search for items..."
            className="w-full px-4 py-2 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-200"
          />
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90">
            <FaSearch />
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-primary">Home</Link>
          <Link href="/products" className="hover:text-primary">Shop</Link>
          <Link href="/blog" className="hover:text-primary">Blog</Link>
          <Link href="#" className="hover:text-primary">Deals</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-4 text-green-700 text-xl">
          <Link href="#" className="hover:text-primary" title="Compare"><FaRegListAlt /></Link>
          <Link href="#" className="hover:text-primary" title="Wishlist"><FaRegHeart /></Link>
          <Link href="#" className="hover:text-primary" title="Cart"><FaShoppingCart /></Link>
          <Link href="#" className="hover:text-primary" title="Account"><FaRegUser /></Link>
        </div>
      </div>
    </header>
  );
} 