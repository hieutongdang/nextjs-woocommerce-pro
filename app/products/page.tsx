import { Metadata } from 'next';
import { client } from '@/lib/apollo-client';
import { GET_ALL_PRODUCTS } from '@/lib/graphql/queries';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';

export const metadata: Metadata = {
  title: 'All Products - NextShop',
  description: 'Browse our collection of products',
};

const PRODUCTS_PER_PAGE = 20;

async function getProducts(page: number) {
  let after = null;
  if (page > 1) {
    // Calculate the cursor for the current page
    let lastCursor = null;
    for (let i = 1; i < page; i++) {
      const { data }: { data: any } = await client.query({
        query: GET_ALL_PRODUCTS,
        variables: { first: PRODUCTS_PER_PAGE, after: lastCursor },
      });
      lastCursor = data.products.pageInfo.endCursor;
    }
    after = lastCursor;
  }
  const { data } = await client.query({
    query: GET_ALL_PRODUCTS,
    variables: { first: PRODUCTS_PER_PAGE, after },
  });
  return {
    products: data.products.nodes,
    hasNextPage: data.products.pageInfo.hasNextPage,
    endCursor: data.products.pageInfo.endCursor,
    debug: { after, count: data.products.nodes.length },
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { products, hasNextPage, debug } = await getProducts(currentPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Products</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            name={product.name}
            slug={product.slug}
            categorySlug={product.productCategories?.nodes?.[0]?.slug || 'uncategorized'}
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
        baseUrl="/products"
      />
    </div>
  );
} 