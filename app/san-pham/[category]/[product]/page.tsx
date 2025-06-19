import { Metadata } from 'next';
import { client } from '@/lib/apollo-client';
import { GET_PRODUCT_BY_SLUG, GET_ALL_CATEGORIES, GET_PRODUCTS_BY_CATEGORY } from '@/lib/graphql/queries';
import { notFound } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { ProductCategoriesWidget } from '@/components/ProductCategories';
import { LatestPostsWidget } from '@/components/Sidebar';
import ProductDetailContent from '@/components/ProductDetailContent';

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
    return { title: 'Không tìm thấy sản phẩm' };
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

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Product Section - 9 columns */}
        <div className="lg:col-span-9">
          <ProductDetailContent slug={params.product} category={params.category} />
        </div>
        {/* Sidebar - 3 columns */}
        <div className="lg:col-span-3">
          <Sidebar>
            <ProductCategoriesWidget />
            <LatestPostsWidget />
          </Sidebar>
        </div>
      </div>
    </div>
  );
} 