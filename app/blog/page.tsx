import { Metadata } from 'next';
import { client } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - NextShop',
  description: 'Read the latest news and articles from our blog.',
};

const POSTS_PER_PAGE = 16;

const GET_PAGINATED_POSTS = gql`
  query GetPaginatedPosts($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
      nodes {
        id
        title
        slug
        excerpt
        date
        categories {
          nodes {
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

async function getPosts(page: number) {
  let after = null;
  if (page > 1) {
    // Calculate the cursor for the current page
    // This is a simple approach; for production, you may want to cache cursors
    const prevPages = [];
    let lastCursor = null;
    for (let i = 1; i < page; i++) {
      const { data }: { data: any } = await client.query({
        query: GET_PAGINATED_POSTS,
        variables: { first: POSTS_PER_PAGE, after: lastCursor },
        fetchPolicy: 'network-only',
      });
      lastCursor = data.posts.pageInfo.endCursor;
      prevPages.push(lastCursor);
    }
    after = prevPages[prevPages.length - 1];
  }
  const { data }: { data: any } = await client.query({
    query: GET_PAGINATED_POSTS,
    variables: { first: POSTS_PER_PAGE, after },
    fetchPolicy: 'network-only',
  });
  return data.posts;
}

interface BlogPageProps {
  searchParams?: { page?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams?.page || '1', 10);
  const postsData = await getPosts(page);
  const posts = postsData.nodes;
  const { hasNextPage, endCursor, hasPreviousPage, startCursor } = postsData.pageInfo;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tin tức</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
      <div className="flex justify-center gap-4">
        {hasPreviousPage && (
          <Link
            href={`/blog?page=${page - 1}`}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 font-semibold"
          >
            Previous
          </Link>
        )}
        <span className="px-4 py-2 font-semibold">Page {page}</span>
        {hasNextPage && (
          <Link
            href={`/blog?page=${page + 1}`}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 font-semibold"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
} 