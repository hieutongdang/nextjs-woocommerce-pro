import { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import { ProductCategoriesWidget } from '@/components/ProductCategories';
import { LatestPostsWidget } from '@/components/Sidebar';
import BlogPostGrid from '@/components/BlogPostGrid';

export const metadata: Metadata = {
  title: 'Blog - NextShop',
  description: 'Read the latest news and articles from our blog.',
};

interface BlogPageProps {
  searchParams?: { page?: string };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams?.page || '1', 10);
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tin tức</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Blog Content */}
        <div className="lg:col-span-9">
          <BlogPostGrid page={page} />
        </div>
        {/* Sidebar */}
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