"use client";
import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

export default function ImageWithLoader({
  src,
  alt,
  className = '',
  ...props
}: ImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse z-10">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <Image
        {...props}
        src={error ? '/images/placeholder.svg' : src}
        alt={alt}
        className={`object-cover object-center transition-all duration-300 ${loading ? 'blur-md scale-105' : 'blur-0 scale-100'} ${className}`}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
    </div>
  );
} 