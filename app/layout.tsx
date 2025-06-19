import './globals.css';
import { ApolloWrapper } from '@/lib/apollo-wrapper';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainLayout from '@/components/layouts/MainLayout';
import { WishlistProvider } from '@/context/WishlistContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CartProvider } from '@/context/CartContext';
import { ProductCategoriesProvider } from '@/context/ProductCategoriesContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WooCommerce Store',
  description: 'Your one-stop shop for all your needs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WishlistProvider>
          <CartProvider>
            <ProductCategoriesProvider>
              <MainLayout>{children}</MainLayout>
            </ProductCategoriesProvider>
          </CartProvider>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </WishlistProvider>
      </body>
    </html>
  );
} 