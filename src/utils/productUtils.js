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

export function getProductById(products, id) {
  if (!Array.isArray(products) || !id) {
    return undefined;
  }

  return products.find((product) => product.id === id);
}
