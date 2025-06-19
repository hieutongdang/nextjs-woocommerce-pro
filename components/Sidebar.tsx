"use client";
import React from 'react';
import { gql } from '@apollo/client';
import { client } from '@/lib/apollo-client';
import { PostCardSidebar } from './PostCard';
import { useEffect, useState } from 'react';

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  return (
    <aside className={`w-full flex-shrink-0 ${className}`}>
      <div className="space-y-8">{children}</div>
    </aside>
  );
};

export default Sidebar;

export const GET_LATEST_POSTS = gql`
  query GetLatestPosts($first: Int!) {
    posts(first: $first) {
      nodes {
        id
        title
        slug
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

export function LatestPostsWidget() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await client.query({
          query: GET_LATEST_POSTS,
          variables: { first: 5 },
        });
        setPosts(data.posts.nodes);
      } catch (err) {
        setError('Không thể tải bài viết mới');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>;
  if (loading) return <div className="p-4 text-gray-500">Đang tải bài viết...</div>;

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4">Bài viết mới nhất</h3>
      <div>
        {posts.map(post => (
          <div key={post.id} className="flex items-center mb-3 last:mb-0">
            <img
              src={post.featuredImage?.node?.sourceUrl || '/images/placeholder.svg'}
              alt={post.featuredImage?.node?.altText || post.title}
              className="w-12 h-12 object-cover rounded mr-3 border"
              width={48}
              height={48}
            />
            <PostCardSidebar
              title={post.title}
              slug={post.slug}
              blogCategorySlug={post.categories.nodes[0]?.slug || 'blog'}
              date={post.date}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 