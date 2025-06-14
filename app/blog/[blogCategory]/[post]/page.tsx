import { Metadata } from 'next';
import Image from 'next/image';
import { client } from '@/lib/apollo-client';
import { GET_POST_BY_SLUG } from '@/lib/graphql/queries';
import { notFound } from 'next/navigation';
import { gql } from '@apollo/client';

interface BlogPostPageProps {
  params: {
    blogCategory: string;
    post: string;
  };
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.post);
  const imageUrl = post.featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const imageAlt = post.featuredImage?.node?.altText || post.title;

  return (
    <article className="container mx-auto px-4 py-8">
      {/* Post Header */}
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <time className="text-gray-500">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg bg-gray-200">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={1200}
            height={675}
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-3xl mx-auto">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
} 