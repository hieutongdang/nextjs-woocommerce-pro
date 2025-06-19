"use client";
import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import PostCard from "./PostCard";
import Link from "next/link";

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

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded shadow p-4 h-64 flex flex-col gap-2">
      <div className="bg-gray-200 h-32 w-full rounded mb-2" />
      <div className="bg-gray-200 h-4 w-3/4 rounded" />
      <div className="bg-gray-200 h-3 w-1/2 rounded" />
      <div className="bg-gray-200 h-3 w-1/3 rounded" />
    </div>
  );
}

export default function BlogPostGrid({ page }: { page: number }) {
  // Calculate 'after' cursor for pagination
  // For simplicity, only support first page for now; advanced cursor logic can be added if needed
  const after = null;
  const { data, loading, error } = useQuery(GET_PAGINATED_POSTS, {
    variables: { first: POSTS_PER_PAGE, after },
    fetchPolicy: "network-only",
  });

  // Memoize posts and pageInfo for performance
  const posts = data?.posts?.nodes || [];
  const pageInfo = data?.posts?.pageInfo || {};

  if (error) {
    return <div className="text-red-500">Failed to load posts.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {loading
          ? Array.from({ length: POSTS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
          : posts.map((post: any) => (
              <PostCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                blogCategorySlug={post.categories?.nodes?.[0]?.slug || "uncategorized"}
                excerpt={post.excerpt}
                date={post.date}
                featuredImage={post.featuredImage}
              />
            ))}
      </div>
      <div className="flex justify-center gap-4">
        {pageInfo.hasPreviousPage && (
          <Link
            href={`/blog?page=${page - 1}`}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 font-semibold"
          >
            Previous
          </Link>
        )}
        <span className="px-4 py-2 font-semibold">Page {page}</span>
        {pageInfo.hasNextPage && (
          <Link
            href={`/blog?page=${page + 1}`}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 font-semibold"
          >
            Next
          </Link>
        )}
      </div>
    </>
  );
} 