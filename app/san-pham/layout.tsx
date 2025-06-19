"use client";
import { ApolloWrapper } from '@/lib/apollo-wrapper';

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <ApolloWrapper>{children}</ApolloWrapper>;
} 