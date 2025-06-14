import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
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
}

export default function ProductCard({
  name,
  slug,
  categorySlug,
  image,
  price,
  regularPrice,
  salePrice,
}: ProductCardProps) {
  const isOnSale = salePrice && salePrice !== price;
  const imageUrl = image?.sourceUrl || '/images/placeholder.svg';
  const imageAlt = image?.altText || name;
  const href = `/products/${categorySlug}/${slug}`;

  return (
    <div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={href}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
          <div className="mt-2 flex items-center">
            {isOnSale ? (
              <>
                <p className="text-lg font-medium text-gray-900">{salePrice}</p>
                <p className="ml-2 text-sm text-gray-500 line-through">{regularPrice}</p>
              </>
            ) : (
              <p className="text-lg font-medium text-gray-900">{price}</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
} 