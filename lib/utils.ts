/**
 * Formats a price string by removing HTML entities and extra spaces
 */
export function formatPrice(price: string | undefined | null): string {
  if (!price) return '';
  
  // Remove HTML entities and any non-breaking spaces
  const cleanPrice = price.replace(/&nbsp;/g, ' ').replace(/&[^;]+;/g, '');
  
  // Remove any extra spaces
  return cleanPrice.trim();
}

/**
 * Checks if a product is on sale by comparing the regular price and sale price
 */
export function isOnSale(regularPrice: string | undefined | null, salePrice: string | undefined | null): boolean {
  if (!regularPrice || !salePrice) return false;
  return formatPrice(salePrice) !== formatPrice(regularPrice);
} 