"use client";
import { useWishlist } from '@/context/WishlistContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useMemo } from 'react';

interface WishlistButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    image?: string;
    price?: string;
    regularPrice?: string;
    salePrice?: string;
  };
  className?: string;
  iconSize?: number;
  activeClassName?: string;
  inactiveClassName?: string;
}

export default function WishlistButton({ product, className = '', iconSize = 20, activeClassName = '', inactiveClassName = '' }: WishlistButtonProps) {
  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const isWishlisted = useMemo(() => wishlistItems.some(item => item.id === product.id), [wishlistItems, product.id]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Đã xóa khỏi danh sách yêu thích!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      addToWishlist({
        ...product,
        image: product.image || '',
        price: product.price || '',
        regularPrice: product.regularPrice || '',
        salePrice: product.salePrice || '',
      });
      toast.success('Đã thêm vào danh sách yêu thích!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`p-3 rounded-full transition-all duration-200 ${isWishlisted ? (activeClassName || 'bg-primary text-white shadow-md') : (inactiveClassName || 'bg-light hover:bg-gray-100 text-secondary')} ${className}`}
      aria-label={isWishlisted ? 'Bỏ khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
    >
      {isWishlisted ? <FaHeart size={iconSize} /> : <FaRegHeart size={iconSize} />}
    </button>
  );
} 