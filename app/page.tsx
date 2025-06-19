import { Metadata } from 'next';
import { client } from '@/lib/apollo-client';
import { GET_LATEST_POSTS, GET_PARENT_CATEGORIES } from '@/lib/graphql/queries';
import ProductCard from '@/components/ProductCard';
import PostCard from '@/components/PostCard';
import HeroBanner from '@/components/HeroBanner';
import PromoCardsSection from '@/components/PromoCardsSection';
import CategoryProductSection from '@/components/CategoryProductSection';
import ProductCategories from '@/components/ProductCategories';
import Link from 'next/link';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaThLarge,
  FaArrowRight,
  FaSpinner
} from 'react-icons/fa';

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
  return data.productCategories.nodes;
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
      {/* <PromoCardsSection /> */}
      <ProductCategories />
      {categories.filter((cat: any) => cat.products && cat.products.nodes && cat.products.nodes.length > 0)
        .map((cat: any) => (
          <CategoryProductSection key={cat.id} category={cat} products={cat.products.nodes} />
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
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary rounded-xl hover:from-primary/20 hover:to-primary/10 transition-all duration-300 font-medium"
        >
              Xem tất cả <FaArrowRight size={12} />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
} 