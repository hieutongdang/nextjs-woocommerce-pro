import { Metadata } from 'next';
import { client } from '@/lib/apollo-client';
import { GET_ALL_CATEGORIES, GET_PRODUCTS_BY_CATEGORY } from '@/lib/graphql/queries';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';

interface CategoryPageProps {
  params: { category: string };
  searchParams: { page?: string };
}

export async function generateStaticParams() {
  const { data } = await client.query({
    query: GET_ALL_CATEGORIES,
    variables: { first: 200 },
  });
  return data.productCategories.nodes.map((cat: any) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { data } = await client.query({
    query: GET_ALL_CATEGORIES,
    variables: { first: 200 },
  });
  const category = data.productCategories.nodes.find((cat: any) => cat.slug === params.category);
  return {
    title: category ? `${category.name} - Products` : 'Category Not Found',
    description: category ? `Browse products in the ${category.name} category.` : '',
  };
}

const PRODUCTS_PER_PAGE = 20;
async function getCategoryWithProducts(slug: string, page: number) {
  let after = null;
  if (page > 1) {
    let lastCursor = null;
    for (let i = 1; i < page; i++) {
      const { data }: { data: any } = await client.query({
        query: GET_PRODUCTS_BY_CATEGORY,
        variables: { slug, first: PRODUCTS_PER_PAGE, after: lastCursor },
      });
      lastCursor = data.productCategory.products.pageInfo.endCursor;
    }
    after = lastCursor;
  }
  const { data } = await client.query({
    query: GET_PRODUCTS_BY_CATEGORY,
    variables: { slug, first: PRODUCTS_PER_PAGE, after },
  });
  return {
    ...data.productCategory,
    debug: { after, count: data.productCategory.products.nodes.length },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps & { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams?.page) || 1;
  const category = await getCategoryWithProducts(params.category, currentPage);
  if (!category) {
    return <div className="container mx-auto px-4 py-8">Category not found.</div>;
  }
  const products = category.products.nodes;
  const hasNextPage = category.products.pageInfo?.hasNextPage;
  const debug = category.debug;
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{category.name}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            name={product.name}
            slug={product.slug}
            categorySlug={category.slug}
            image={product.image}
            price={product.price}
            regularPrice={product.regularPrice}
            salePrice={product.salePrice}
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        hasNextPage={hasNextPage}
        baseUrl={`/products/${category.slug}`}
      />
    </div>
  );
} 