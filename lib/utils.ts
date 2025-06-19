/**
 * Formats a price string by removing HTML entities and extra spaces
 */
export function cleanPriceString(price: string | undefined | null): string {
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
  return cleanPriceString(salePrice) !== cleanPriceString(regularPrice);
}

function extractNumericIdFromBase64(id: string): number {
  try {
    const decoded = atob(id);
    // Expecting format like 'post:30467' or 'product:12345'
    const match = decoded.match(/:(\d+)$/);
    if (match) {
      return parseInt(match[1], 10);
    }
  } catch (e) {
    // Fallback: try to parse as number directly
    return parseInt(id, 10);
  }
  return NaN;
}

export const addProductToCart = (product: any, addToCart: (product: any) => void) => {
  const numericId = extractNumericIdFromBase64(product.id);
  const cartItem = {
    id: numericId,
    name: product.name,
    price: parseFloat(product.price),
    image: product.image?.sourceUrl || '/images/placeholder.svg',
    quantity: 1
  };
  //console.log('addProductToCart - cartItem:', cartItem);
  // The addToCart function from CartContext will handle the logic for:
  // - If product exists: increase quantity
  // - If product doesn't exist: add new item
  addToCart(cartItem);
};

/**
 * Formats a price to Vietnamese currency format
 */
export const formatPrice = (price: string | number | undefined): string => {
  if (!price) return '0 ₫';
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  // Multiply by 1000000 to convert to VND (assuming prices are in thousands)
  const priceInVND = numericPrice * 1000000;
  return `${priceInVND.toLocaleString('vi-VN')} ₫`;
};

export const formatCartItemPrice = (price: number): string => {
  return formatPrice(price);
};

export const formatCartTotal = (total: number): string => {
  return formatPrice(total);
}; 