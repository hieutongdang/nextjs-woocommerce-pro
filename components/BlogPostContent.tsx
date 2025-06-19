"use client";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Clock, Calendar, User } from "lucide-react";

// Query to get database ID by slug
const GET_POST_ID_BY_SLUG = gql`
  query GetPostIdBySlug($slug: String!) {
    postBy(slug: $slug) {
      databaseId
    }
  }
`;

// Existing query to get post by database ID
const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!, $idType: PostIdType!) {
    post(id: $id, idType: $idType) {
      id
      title
      content
      date
      author {
        node {
          name
        }
      }
      tags {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

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

function addHeadingIds(content: string) {
  return content.replace(/<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi, (match, level, attrs, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const id = cleanText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
  });
}

function SkeletonPost() {
  return (
    <div>
      <div className="animate-pulse mb-4">
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="flex gap-4 mb-6">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="animate-pulse bg-gradient-to-br from-light to-info/5 border border-info/20 rounded-xl p-6 mb-8 shadow-sm">
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
      </div>
      <div className="animate-pulse space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-full bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

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

export default function BlogPostContent({ slug }: { slug: string; category: string }) {
  // Step 1: Get database ID from slug
  const { data: idData, loading: idLoading, error: idError } = useQuery(GET_POST_ID_BY_SLUG, {
    variables: { slug },
  });

  const databaseId = idData?.postBy?.databaseId;

  // Step 2: Use database ID to fetch post
  const { data, loading, error } = useQuery(GET_POST_BY_ID, {
    skip: !databaseId,
    variables: { id: databaseId, idType: "DATABASE_ID" },
    fetchPolicy: "network-only",
  });

  if (idLoading || loading) return <SkeletonPost />;
  if (idError || error || !data?.post) return <div className="text-red-500">Không tìm thấy bài viết.</div>;

  const post = data.post;
  const headings = extractHeadings(post.content);
  const contentWithIds = addHeadingIds(post.content);
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <>
      {/* Post Header */}
      <header className="w-full mx-auto mb-2 pb-2">
        <div className="mb-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-dark leading-tight mb-6">
            {post.title}
          </h1>
          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary/60" />
              <time>{new Date(post.date).toLocaleDateString('vi-VN')}</time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary/60" />
              <span>{readingTime} phút đọc</span>
            </div>
            {post.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-secondary/60" />
                <span>{post.author.node?.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>
      {/* Table of Contents */}
      <TableOfContents headings={headings} />
      {/* Post Content */}
      <div className="w-full mx-auto">
        <div
          className="prose max-w-none 
                   prose-headings:scroll-mt-20 
                   prose-headings:font-semibold 
                   prose-h1:text-xl prose-h1:text-dark prose-h1:border-b prose-h1:border-secondary/20 prose-h1:pb-3 prose-h1:mb-6
                   prose-h2:text-xl prose-h2:text-dark prose-h2:mt-12 prose-h2:mb-4
                   prose-h3:text-xl prose-h3:text-dark prose-h3:mt-8 prose-h3:mb-3
                   prose-h4:text-xl prose-h4:text-dark prose-h4:mt-6 prose-h4:mb-2
                   prose-h5:text-lg prose-h5:text-dark prose-h5:mt-4 prose-h5:mb-2
                   prose-h6:text-base prose-h6:text-dark prose-h6:mt-4 prose-h6:mb-2
                   prose-p:text-base prose-p:text-secondary prose-p:leading-relaxed prose-p:mb-4
                   prose-a:text-primary prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary/80
                   prose-strong:text-dark prose-strong:font-semibold
                   prose-ul:my-6 prose-ol:my-6
                   prose-li:text-secondary prose-li:my-1 prose-li:text-base
                   prose-blockquote:border-l-4 prose-blockquote:border-info/30 prose-blockquote:bg-info/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:text-secondary
                   prose-code:bg-light prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-primary
                   prose-pre:bg-dark prose-pre:rounded-lg prose-pre:overflow-x-auto
                   prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8"
          dangerouslySetInnerHTML={{ __html: contentWithIds }}
        />
      </div>
      {/* Post Footer */}
      <footer className="w-full mx-auto mt-12 pt-8 border-t border-secondary/20">
        <div className="flex flex-wrap gap-2">
          {post.tags?.nodes?.map((tag: any) => (
            <span
              key={tag.slug}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-light text-secondary hover:bg-primary hover:text-white transition-colors"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </footer>
    </>
  );
} 