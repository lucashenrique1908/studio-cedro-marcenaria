import { products } from './products.js';

export const ALL_PRODUCTS_CATEGORY = 'all';

function formatCategoryLabel(category) {
  return category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const categories = [
  {
    id: ALL_PRODUCTS_CATEGORY,
    label: 'Todos',
  },
  ...products.map((product) => ({
    id: product.category,
    label: formatCategoryLabel(product.category),
  })),
];
