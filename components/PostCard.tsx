import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, User } from 'lucide-react';

interface PostCardProps {
  title: string;
  slug: string;
  blogCategorySlug: string;
  excerpt: string;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    };
  } | null;
}

export default function PostCard({
  title,
  slug,
  blogCategorySlug,
  excerpt,
  date,
  featuredImage,
}: PostCardProps) {
  const imageUrl = featuredImage?.node?.sourceUrl || '/images/placeholder.svg';
  const imageAlt = featuredImage?.node?.altText || title;
  const href = `/blog/${blogCategorySlug}/${slug}`;

  return (
    <article className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={href}>
        <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-200">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={800}
            height={450}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
        <div className="flex-1 p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
          <div
            className="text-gray-600 text-sm mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
          <div className="flex items-center gap-2">
  <Calendar className="w-4 h-4 text-secondary/60" />
  <time className="text-sm text-gray-500">
    {new Date(date).toLocaleDateString('vi-VN')}
  </time>
</div>

        </div>
      </Link>
    </article>
  );
}

export function PostCardSidebar({ title, slug, blogCategorySlug, date }: Omit<PostCardProps, 'excerpt' | 'featuredImage'>) {
  const href = `/blog/${blogCategorySlug}/${slug}`;
  return (
    <div className="mb-2">
      <Link href={href} className="text-primary hover:underline font-medium block">
        {title}
      </Link>
      <div className="flex items-center gap-2">
  <Calendar className="w-4 h-4 text-secondary/60" />
  <time className="text-sm text-gray-500">
    {new Date(date).toLocaleDateString('vi-VN')}
  </time>
</div>

    </div>
  );
} 