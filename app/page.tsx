import { Metadata } from 'next';
import { client } from '@/lib/apollo-client';
import { GET_LATEST_POSTS, GET_PARENT_CATEGORIES, GET_PRODUCTS_BY_CATEGORY } from '@/lib/graphql/queries';
import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import HeroBanner from '@/components/HeroBanner';
import PromoCardsSection from '@/components/PromoCardsSection';
import CategoryProductSection from '@/components/CategoryProductSection';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NextShop - Modern eCommerce Store',
  description: 'Discover our latest products and blog posts',
};

async function getTopCategoriesWithProducts() {
  const { data } = await client.query({
    query: GET_PARENT_CATEGORIES,
    variables: {
      first: 4,
    },
  });
  let categories = data.productCategories.nodes;
  // Optionally sort by count or name, since menu_order is not available
  // categories = categories.sort((a, b) => b.count - a.count); // Example: sort by product count desc

  const categoriesWithProducts = await Promise.all(
    categories.map(async (cat: any) => {
      const { data: prodData } = await client.query({
        query: GET_PRODUCTS_BY_CATEGORY,
        variables: { slug: cat.slug, first: 10 },
      });
      return {
        ...cat,
        products: prodData.productCategory.products.nodes,
      };
    })
  );
  return categoriesWithProducts;
}

async function getLatestPosts() {
  const { data } = await client.query({
    query: GET_LATEST_POSTS,
    variables: { first: 4 },
  });
  return data.posts.nodes;
}

export default async function Home() {
  const [categories, posts] = await Promise.all([
    getTopCategoriesWithProducts(),
    getLatestPosts(),
  ]);

  return (
    <>
      <HeroBanner />
      <PromoCardsSection />
      {categories.map((cat: any) => (
        <CategoryProductSection key={cat.id} category={cat} products={cat.products} />
      ))}
      <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
        {/* Latest Blog Posts Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Tin tức</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {posts.map((post: any) => (
              <PostCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                blogCategorySlug={post.categories?.nodes?.[0]?.slug || 'uncategorized'}
                excerpt={post.excerpt}
                date={post.date}
                featuredImage={post.featuredImage}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              href="/blog"
              className="px-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition"
            >
              Xem tất cả
            </Link>
          </div>
        </section>
      </div>
    </>
  );
} 