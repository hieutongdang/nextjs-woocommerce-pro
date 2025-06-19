"use client";
import { ApolloWrapper } from '@/lib/apollo-wrapper';

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <ApolloWrapper>{children}</ApolloWrapper>;
} 