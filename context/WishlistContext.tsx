'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  image: string;
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

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems(prev => {
      if (!prev.some(i => i.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const isInWishlist = (itemId: string) => {
    return wishlistItems.some(item => item.id === itemId);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
} 












