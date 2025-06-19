'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { client } from '@/lib/apollo-client';
import { GET_PARENT_CATEGORIES, GET_PARENT_AND_CHILD_CATEGORIES } from '@/lib/graphql/queries';

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  image?: {
    sourceUrl: string;
    altText: string;
  };
  children?: { nodes: Category[] };
}

interface ProductCategoriesContextType {
  parentCategories: Category[];
  parentAndChildCategories: Category[];
  isLoading: boolean;
  error: string | null;
}

const ProductCategoriesContext = createContext<ProductCategoriesContextType | undefined>(undefined);

export const ProductCategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [parentAndChildCategories, setParentAndChildCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch parent categories for homepage
        const { data: parentData } = await client.query({
          query: GET_PARENT_CATEGORIES,
          variables: { first: 20 },
        });
        setParentCategories(parentData.productCategories.nodes);
        // Fetch parent+child categories for header/sidebar
        const { data: parentChildData } = await client.query({
          query: GET_PARENT_AND_CHILD_CATEGORIES,
          variables: { first: 20 },
        });
        setParentAndChildCategories(parentChildData.productCategories.nodes);
      } catch (err) {
        setError('Không thể tải danh mục sản phẩm');
        setParentCategories([]);
        setParentAndChildCategories([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <ProductCategoriesContext.Provider value={{ parentCategories, parentAndChildCategories, isLoading, error }}>
      {children}
    </ProductCategoriesContext.Provider>
  );
};

export const useProductCategories = () => {
  const context = useContext(ProductCategoriesContext);
  if (context === undefined) {
    throw new Error('useProductCategories must be used within a ProductCategoriesProvider');
  }
  return context;
}; 