'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { 
  FaRegHeart, 
  FaRegUser, 
  FaShoppingCart, 
  FaSearch, 
  FaPhoneAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight
} from 'react-icons/fa';
import { client } from '@/lib/apollo-client';
import { GET_ALL_PARENT_CATEGORIES } from '@/lib/graphql/queries';

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
  parentId?: string | null;
  children?: { nodes: Category[] };
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await client.query({
          query: GET_ALL_PARENT_CATEGORIES,
          variables: { first: 100 },
        });
        setCategories(data.productCategories.nodes);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Handle click outside to close dropdown and mobile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setActiveSubmenu(null);
      }
    }
    
    if (dropdownOpen || isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleDropdownEnter = () => {
    if (dropdownTimeout.current) {
      clearTimeout(dropdownTimeout.current);
    }
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  const toggleSubmenu = (categoryId: string) => {
    setActiveSubmenu(activeSubmenu === categoryId ? null : categoryId);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        {/* Top bar - Hidden on mobile */}
        <div className="hidden lg:block bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-2">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div className="flex items-center gap-6">
                <span>📧 info@cuanhua.com.vn</span>
                <span>🕒 8:00 - 18:00 (T2-T7)</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Miễn phí vận chuyển đơn từ 2 triệu</span>
                <div className="flex gap-2">
                  <span className="w-6 h-4 bg-red-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">🇻🇳</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold">
                SD
              </div>
              <span className="hidden sm:block bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                SaigonDoor
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <form className="hidden md:flex flex-1 max-w-2xl mx-4 relative group">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm, danh mục..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 group-hover:border-gray-300"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FaSearch size={16} />
                </button>
              </div>
            </form>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
              <Link href="/" className="hover:text-primary transition-colors relative group">
                Trang chủ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link href="/gioi-thieu" className="hover:text-primary transition-colors relative group">
                Giới thiệu
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <div className="relative" ref={dropdownRef}>
                <button
                  className="hover:text-primary flex items-center gap-2 focus:outline-none transition-colors relative group"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  Sản phẩm
                  <FaChevronDown className={`w-3 h-3 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </button>
                
                {dropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-in slide-in-from-top-2 duration-200"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {categories.map((parent) => (
                      <div key={parent.id} className="group/item relative">
                        <Link
                          href={`/san-pham/${parent.slug}`}
                          className="flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:text-primary rounded-lg mx-2 transition-all duration-200"
                        >
                          <span className="font-medium">{parent.name}</span>
                          {parent.children && parent.children.nodes.length > 0 && (
                            <FaChevronRight className="w-3 h-3 opacity-50" />
                          )}
                        </Link>
                        
                        {parent.children && parent.children.nodes.length > 0 && (
                          <div className="absolute left-full top-0 ml-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200">
                            {parent.children.nodes.map((child) => (
                              <Link
                                key={child.id}
                                href={`/san-pham/${child.slug}`}
                                className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:text-primary rounded-lg mx-2 transition-all duration-200"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Link href="/blog" className="hover:text-primary transition-colors relative group">
                Tin tức
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              <Link href="/lien-he" className="hover:text-primary transition-colors relative group">
                Liên hệ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile search button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Search"
              >
                <FaSearch size={18} />
              </button>

              {/* Action buttons */}
              <div className="flex items-center gap-2 md:gap-3">
                <Link 
                  href="#" 
                  className="p-2 md:p-2.5 rounded-lg hover:bg-gray-100 transition-colors relative group" 
                  title="Yêu thích"
                >
                  <FaRegHeart size={18} className="text-gray-600 group-hover:text-red-500 transition-colors" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">0</span>
                </Link>
                
                <Link 
                  href="#" 
                  className="p-2 md:p-2.5 rounded-lg hover:bg-gray-100 transition-colors relative group" 
                  title="Giỏ hàng"
                >
                  <FaShoppingCart size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-xs rounded-full flex items-center justify-center">0</span>
                </Link>
                
                <Link 
                  href="#" 
                  className="p-2 md:p-2.5 rounded-lg hover:bg-gray-100 transition-colors group" 
                  title="Tài khoản"
                >
                  <FaRegUser size={18} className="text-gray-600 group-hover:text-primary transition-colors" />
                </Link>
              </div>

              {/* Phone button - Desktop */}
              <a 
                href="tel:0987483960" 
                className="hidden xl:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
              >
                <FaPhoneAlt size={14} />
                <span className="font-semibold">0987 483 960</span>
              </a>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden mt-4 animate-in slide-in-from-top-2 duration-200">
              <form className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FaSearch size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                SD
              </div>
              <span className="font-bold text-primary">SaigonDoor</span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Mobile menu content */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-2">
              <Link 
                href="/" 
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                🏠 Trang chủ
              </Link>
              
              <Link 
                href="/gioi-thieu" 
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                ℹ️ Giới thiệu
              </Link>

              {/* Mobile Products Menu */}
              <div>
                <button
                  onClick={() => toggleSubmenu('products')}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-left"
                >
                  <span>🛍️ Sản phẩm</span>
                  <FaChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeSubmenu === 'products' ? 'rotate-180' : ''}`} />
                </button>
                
                {activeSubmenu === 'products' && (
                  <div className="ml-4 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {categories.map((parent) => (
                      <div key={parent.id}>
                        <div className="flex items-center justify-between">
                          <Link
                            href={`/san-pham/${parent.slug}`}
                            className="flex-1 py-2 px-4 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors text-gray-700"
                            onClick={closeMobileMenu}
                          >
                            {parent.name}
                          </Link>
                          {parent.children && parent.children.nodes.length > 0 && (
                            <button
                              onClick={() => toggleSubmenu(parent.id)}
                              className="p-2 rounded-lg hover:bg-gray-100"
                            >
                              <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeSubmenu === parent.id ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                        
                        {activeSubmenu === parent.id && parent.children && (
                          <div className="ml-4 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                            {parent.children.nodes.map((child) => (
                              <Link
                                key={child.id}
                                href={`/san-pham/${child.slug}`}
                                className="block py-2 px-4 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors text-gray-600 text-sm"
                                onClick={closeMobileMenu}
                              >
                                • {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                href="/blog" 
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                📰 Tin tức
              </Link>
              
              <Link 
                href="/lien-he" 
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                onClick={closeMobileMenu}
              >
                📞 Liên hệ
              </Link>
            </nav>
          </div>

          {/* Mobile menu footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <a 
              href="tel:0987483960" 
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
            >
              <FaPhoneAlt size={16} />
              <span>Gọi ngay: 0987 483 960</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}