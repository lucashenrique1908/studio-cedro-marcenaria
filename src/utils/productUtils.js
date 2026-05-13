import { ALL_PRODUCTS_CATEGORY } from '../data/categories';

export function filterProducts(products, category) {
  if (!Array.isArray(products)) {
    return [];
  }

  if (!category || category === ALL_PRODUCTS_CATEGORY) {
    return products;
  }

  return products.filter((product) => product.category === category);
}
