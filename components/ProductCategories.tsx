'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { client } from '@/lib/apollo-client';
import { GET_PARENT_CATEGORIES } from '@/lib/graphql/queries';
import useEmblaCarousel from 'embla-carousel-react';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaThLarge,
  FaArrowRight,
  FaSpinner
} from 'react-icons/fa';

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  image?: {
    sourceUrl: string;
    altText: string;
  };
}

export default function ProductCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    skipSnaps: false,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 },
      '(min-width: 768px)': { slidesToScroll: 3 },
      '(min-width: 1024px)': { slidesToScroll: 4 },
      '(min-width: 1280px)': { slidesToScroll: 6 },
    },
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await client.query({
          query: GET_PARENT_CATEGORIES,
          variables: { first: 20 },
        });
        setCategories(data.productCategories.nodes);
      } catch (err) {
        setError('Không thể tải danh mục sản phẩm');
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (error) {
    return (
      <section className="w-full max-w-[1440px] mx-auto py-8">
        <div className="text-center py-12">
          <div className="text-red-500 mb-2">
            <FaThLarge size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[1440px] mx-auto py-8 md:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
            <FaThLarge className="text-white" size={18} />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Khám phá các sản phẩm chất lượng cao
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="p-3 rounded-xl bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Danh mục trước"
          >
            <FaChevronLeft className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="p-3 rounded-xl bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            aria-label="Danh mục tiếp theo"
          >
            <FaChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* View all link */}
        <Link
          href="/san-pham"
          className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-xl hover:from-primary/20 hover:to-primary/10 transition-all duration-300 font-medium"
        >
          <span>Xem tất cả</span>
          <FaArrowRight size={12} />
        </Link>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3 text-gray-600">
            <FaSpinner className="animate-spin" size={20} />
            <span>Đang tải danh mục...</span>
          </div>
        </div>
      )}

      {/* Categories carousel */}
      {!isLoading && categories.length > 0 && (
        <div className="relative">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex gap-4">
              {categories.map((category, index) => (
                <div 
                  key={category.id} 
                  className="flex-[0_0_50%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_25%] xl:flex-[0_0_20%] 2xl:flex-[0_0_16.66%] min-w-0"
                >
                  <CategoryCard category={category} index={index} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="flex md:hidden items-center justify-center gap-4 mt-6">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="p-3 rounded-full bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Danh mục trước"
            >
              <FaChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="p-3 rounded-full bg-white border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Danh mục tiếp theo"
            >
              <FaChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && categories.length === 0 && (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <FaThLarge size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-gray-600">Chưa có danh mục sản phẩm nào</p>
        </div>
      )}

      {/* View all mobile */}
      <div className="flex lg:hidden justify-center mt-8">
        <Link
          href="/san-pham"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-white rounded-xl hover:from-primary/90 hover:to-primary/80 transition-all duration-300 font-medium shadow-lg"
        >
          <span>Xem tất cả danh mục</span>
          <FaArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

// Separate CategoryCard component for better performance
function CategoryCard({ category, index }: { category: Category; index: number }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <Link
      href={`/san-pham/${category.slug}`}
      className="group block bg-white rounded-2xl border border-gray-100 hover:border-primary/20 transition-all duration-300 overflow-hidden hover:shadow-xl transform hover:scale-[1.02]"
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Image container */}
      <div className="relative aspect-square p-4">
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          )}
          
          <Image
            src={category.image?.sourceUrl || '/images/placeholder.svg'}
            alt={category.image?.altText || category.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className={`object-cover transition-all duration-500 p-3 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            } group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Category count badge */}
        {category.count && category.count > 0 && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-primary/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
            {category.count}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        <h3 className="font-semibold text-gray-900 text-center group-hover:text-primary transition-colors duration-300 line-clamp-2 text-sm md:text-base">
          {category.name}
        </h3>
        
        {/* Hover indicator */}
        <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="text-xs text-primary font-medium flex items-center gap-1">
            Xem sản phẩm
            <FaArrowRight size={10} />
          </span>
        </div>
      </div>

      {/* Bottom border animation */}
      <div className="h-1 bg-gradient-to-r from-primary to-primary/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </Link>
  );
}