import { Metadata } from 'next';
import Image from 'next/image';
import { client } from '@/lib/apollo-client';
import { GET_PRODUCT_BY_SLUG, GET_ALL_CATEGORIES, GET_PRODUCTS_BY_CATEGORY } from '@/lib/graphql/queries';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    category: string;
    product: string;
  };
}

export async function generateStaticParams() {
  const { data } = await client.query({
    query: GET_ALL_CATEGORIES,
    variables: { first: 200 },
  });
  const categories = data.productCategories.nodes;
  let paths: { category: string; product: string }[] = [];
  for (const cat of categories) {
    const { data: prodData } = await client.query({
      query: GET_PRODUCTS_BY_CATEGORY,
      variables: { slug: cat.slug, first: 200 },
    });
    for (const prod of prodData.productCategory.products.nodes) {
      paths.push({ category: cat.slug, product: prod.slug });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { data } = await client.query({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug: params.product },
  });
  if (!data.product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: `${data.product.name} - NextShop`,
    description: data.product.description?.replace(/<[^>]*>/g, '').slice(0, 160),
  };
}

async function getProduct(slug: string) {
  const { data } = await client.query({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug },
  });
  if (!data.product) {
    notFound();
  }
  return data.product;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.product);
  const imageUrl = product.image?.sourceUrl || '/images/placeholder.svg';
  const imageAlt = product.image?.altText || product.name;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={800}
            height={800}
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="mb-6">
            <p className="text-2xl font-medium text-gray-900">
              {product.price}
              {product.salePrice && product.salePrice !== product.price && (
                <span className="ml-2 text-lg text-gray-500 line-through">
                  {product.regularPrice}
                </span>
              )}
            </p>
          </div>
          {/* Categories */}
          {product.productCategories?.nodes?.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-medium text-gray-900">Categories</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.productCategories.nodes.map((category: any) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      
      {product.description && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: product.description }} />
        </section>
      )}
    </div>
  );
} 