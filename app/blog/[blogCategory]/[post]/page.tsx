import { Metadata } from 'next';
import { client } from '@/lib/apollo-client';
import { GET_POST_BY_SLUG } from '@/lib/graphql/queries';
import { notFound } from 'next/navigation';
import { gql } from '@apollo/client';
import Sidebar from '@/components/Sidebar';
import { ProductCategoriesWidget } from '@/components/ProductCategories';
import { LatestPostsWidget } from '@/components/Sidebar';
import BlogPostContent from '@/components/BlogPostContent';
import { Clock, Calendar, User } from 'lucide-react';
import dynamic from 'next/dynamic';

interface BlogPostPageProps {
  params: {
    blogCategory: string;
    post: string;
  };
}

// Extract headings from HTML content for Table of Contents
function extractHeadings(content: string) {
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    headings.push({ level, text, id });
  }

  return headings;
}

// Add IDs to headings in content
function addHeadingIds(content: string) {
  return content.replace(/<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi, (match, level, attrs, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
  });
}

// Table of Contents Component
function TableOfContents({ headings }: { headings: { level: number; text: string; id: string }[] }) {
  if (headings.length === 0) return null;

  return (
    <nav className="bg-gradient-to-br from-light to-info/5 border border-info/20 rounded-xl p-6 mb-8 shadow-sm">
      <h2 className="text-lg font-semibold text-dark mb-4 flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-primary to-alert rounded-full"></div>
        Nội dung bài viết
      </h2>
      <ul className="space-y-2">
        {headings.map((heading, index) => (
          <li key={index} className={`${heading.level > 2 ? 'ml-4' : ''}`}>
            <a
              href={`#${heading.id}`}
              className={`
                block text-sm hover:text-primary transition-colors duration-200 py-1 px-2 rounded-md hover:bg-white/50
                ${heading.level === 1 ? 'font-medium text-dark' : 
                  heading.level === 2 ? 'font-medium text-dark/80' : 'text-secondary'}
              `}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// You will need a query to fetch all blog categories and posts for SSG
const GET_ALL_BLOG_CATEGORIES_AND_POSTS = gql`
  query GetAllBlogCategoriesAndPosts($first: Int!) {
    categories(first: $first) {
      nodes {
        slug
        posts(first: $first) {
          nodes {
            slug
          }
        }
      }
    }
  }
`;

export async function generateStaticParams() {
  const { data } = await client.query({
    query: GET_ALL_BLOG_CATEGORIES_AND_POSTS,
    variables: { first: 100 },
  });
  const paths: { blogCategory: string; post: string }[] = [];
  for (const cat of data.categories.nodes) {
    for (const post of cat.posts.nodes) {
      paths.push({ blogCategory: cat.slug, post: post.slug });
    }
  }
  return paths;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { data } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { slug: params.post },
  });
  if (!data.post) {
    return { title: 'Post Not Found' };
  }
  return {
    title: `${data.post.title} - NextShop Blog`,
    description: data.post.content?.replace(/<[^>]*>/g, '').slice(0, 160),
  };
}

const Seo = dynamic(() => import('@/components/Seo'), { ssr: false });

async function getPost(slug: string) {
  const { data } = await client.query({
    query: GET_POST_BY_SLUG,
    variables: { slug },
  });
  if (!data.post) {
    notFound();
  }
  return data.post;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <div className="w-full max-w-[1440px] mx-auto mb-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <article className="w-full lg:col-span-9">
        <BlogPostContent slug={params.post} category={params.blogCategory} />
      </article>
      <div className="lg:col-span-3">
        <Sidebar>
          <ProductCategoriesWidget />
          <LatestPostsWidget />
        </Sidebar>
      </div>
    </div>
  );
}