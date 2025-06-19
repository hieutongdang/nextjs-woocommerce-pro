"use client";
import { useState, useCallback, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import { formatPrice, isOnSale } from "@/lib/utils";
import { FaShoppingCart, FaPhoneAlt, FaComments, FaHeart, FaRegHeart, FaFacebookF, FaChevronLeft, FaChevronRight, FaTag } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import WishlistButton from './WishlistButton';

const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($id: ID!, $idType: ProductIdTypeEnum!) {
    product(id: $id, idType: $idType) {
      id
      name
      description
      shortDescription
      image {
        sourceUrl
        altText
      }
      galleryImages {
        nodes {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
      ... on SimpleProduct {
        regularPrice
        salePrice
      }
      ... on VariableProduct {
        regularPrice
        salePrice
      }
    }
  }
`;

function SkeletonProductDetail() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-gray-200 rounded-lg h-96" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-12 bg-gray-200 rounded w-full" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function ProductDetailContent({ slug }: { slug: string; category: string }) {
  console.log('ProductDetailContent slug:', slug);
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_SLUG, {
    variables: { id: slug, idType: 'SLUG' },
    fetchPolicy: "network-only",
  });
  
  const hotline = process.env.NEXT_PUBLIC_HOTLINE;
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  
  const { addToCart } = useCart();
  
  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: 'start',
    skipSnaps: false,
    dragFree: false
  });
  
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    axis: 'x'
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaApi || !thumbsApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi, thumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi || !thumbsApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    thumbsApi.scrollTo(emblaApi.selectedScrollSnap());
  }, [emblaApi, thumbsApi, setSelectedIndex]);

  const handleAddToCart = () => {
    if (!data?.product) return;
    
    const product = data.product;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.regularPrice,
      regularPrice: product.regularPrice,
      salePrice: product.salePrice,
      image: product.image?.sourceUrl || '/images/placeholder.svg',
      quantity: 1,
      slug: slug,
    });
    
    toast.success('Đã thêm sản phẩm vào giỏ hàng!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(data?.product?.name || '');
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(); // Set initial selected index
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
    // Cleanup
    return () => {
      emblaApi.off('reInit', onSelect);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);
  
  if (loading) return <SkeletonProductDetail />;
  if (error || !data?.product) return <div className="text-alert">Không tìm thấy sản phẩm.</div>;
  
  const product = data.product;
  const imageUrl = product.image?.sourceUrl || '/images/placeholder.svg';
  const imageAlt = product.image?.altText || product.name;
  const onSale = isOnSale(product.regularPrice, product.salePrice);
  
  // Get gallery images (main image + gallery images)
  const galleryImages = [
    { sourceUrl: imageUrl, altText: imageAlt },
    ...(product.galleryImages?.nodes || [])
  ];

  return (
    <div>
      {/* Product Gallery and Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery with Embla Carousel */}
        <div className="space-y-4">
          {/* Main Carousel */}
          <div className="relative overflow-hidden rounded-xl bg-light shadow-sm">
            <div className="embla" ref={emblaRef}>
              <div className="embla__container flex">
                {galleryImages.map((image, index) => (
                  <div key={index} className="embla__slide flex-none w-full">
                    <div className="aspect-square relative">
                      <Image
                        src={image.sourceUrl}
                        alt={image.altText || product.name}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Arrows */}
            {galleryImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-dark p-2 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
                  onClick={scrollPrev}
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-dark p-2 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
                  onClick={scrollNext}
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
            
            {/* Image Counter */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-dark/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {selectedIndex + 1} / {galleryImages.length}
              </div>
            )}
          </div>
          
          {/* Thumbnail Carousel */}
          {galleryImages.length > 1 && (
            <div className="embla-thumbs" ref={thumbsRef}>
              <div className="embla__container flex gap-2">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    className={`embla__slide flex-none w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedIndex === index 
                        ? 'border-primary shadow-md' 
                        : 'border-gray-200 hover:border-secondary'
                    }`}
                    onClick={() => onThumbClick(index)}
                  >
                    <Image
                      src={image.sourceUrl}
                      alt={image.altText || product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Product Name & Actions */}
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-dark flex-1 pr-4">{product.name}</h1>
            <div className="flex gap-2">
              <WishlistButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: slug,
                  image: imageUrl,
                  price: product.salePrice || product.regularPrice || '',
                  regularPrice: product.regularPrice || '',
                  salePrice: product.salePrice || '',
                }}
              />
              <button
                onClick={handleFacebookShare}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md"
              >
                <FaFacebookF className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Price */}
          <div className="mb-6">
            {onSale ? (
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-primary">{formatPrice(product.salePrice)}</p>
                <p className="text-lg text-secondary line-through">{formatPrice(product.regularPrice)}</p>
                <span className="bg-alert text-white px-2 py-1 rounded-md text-sm font-medium">
                  SALE
                </span>
              </div>
            ) : (
              <p className="text-3xl font-bold text-dark">{formatPrice(product.regularPrice)}</p>
            )}
          </div>
          
          {/* Short Description */}
          {product.shortDescription && (
            <div className="text-secondary leading-relaxed bg-light p-4 rounded-xl">
              <div dangerouslySetInnerHTML={{ __html: product.shortDescription }} />
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Add to Cart Button */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary/90 text-white py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-lg shadow-md hover:shadow-lg"
            >
              <FaShoppingCart className="w-5 h-5" />
              Thêm vào giỏ hàng
            </button>

            {/* Contact Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href={`mailto:${supportEmail}`}
                className="bg-info hover:bg-info/90 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
              >
                <FaComments className="w-4 h-4" />
                Tư vấn qua Email
              </Link>

              <Link
                href={`tel:${hotline}`}
                className="bg-success hover:bg-success/90 text-white py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
              >
                <FaPhoneAlt className="w-4 h-4" />
                Tư vấn qua điện thoại
              </Link>
            </div>
          </div>
          
          {/* Categories */}
{/* {product.productCategories?.nodes?.length > 0 && (
  <div className="pt-6 border-t border-gray-200">
    <h3 className="text-sm font-semibold text-dark mb-3 uppercase tracking-wide flex items-center gap-2">
      <FaTag className="text-primary" />
      Danh mục
    </h3>
    <div className="flex flex-wrap gap-2">
      {product.productCategories.nodes.map((category: any) => (
        <Link
          key={category.id}
          href={`/san-pham/${category.slug}`}
          className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-light text-secondary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer border border-gray-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary capitalize"
          aria-label={`Xem sản phẩm trong danh mục ${category.name}`}
        >
          <FaTag className="mr-1 text-xs" />
          {category.name}
        </Link>
      ))}
    </div>
  </div>
)} */}
        </div>
      </div>
      
      {/* Product Description */}
      {product.description && (
        <section className="bg-light rounded-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-dark mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Mô tả sản phẩm
          </h2>
          <div className="prose max-w-none text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: product.description }} />
        </section>
      )}

      {/* Embla Carousel Styles */}
      <style jsx>{`
        .embla {
          overflow: hidden;
        }
        .embla__container {
          display: flex;
        }
        .embla__slide {
          flex: 0 0 100%;
          min-width: 0;
        }
        .embla-thumbs {
          overflow: hidden;
        }
        .embla-thumbs .embla__container {
          display: flex;
          gap: 0.5rem;
        }
        .embla-thumbs .embla__slide {
          flex: 0 0 auto;
        }
      `}</style>
    </div>
  );
}