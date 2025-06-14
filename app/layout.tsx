import './globals.css';
import { ApolloWrapper } from '@/lib/apollo-wrapper';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainLayout from '@/components/layouts/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js WooCommerce Store',
  description: 'Modern eCommerce store built with Next.js and WooCommerce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <MainLayout>{children}</MainLayout>
        </ApolloWrapper>
      </body>
    </html>
  );
} 