import { useMemo, useState } from 'react';
import { ALL_PRODUCTS_CATEGORY } from '../data/categories';
import { products } from '../data/products';
import { filterProducts } from '../utils/productUtils';

export function useProducts(initialCategory = ALL_PRODUCTS_CATEGORY) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredProducts = useMemo(
    () => filterProducts(products, selectedCategory),
    [selectedCategory],
  );

  function changeCategory(category) {
    setSelectedCategory(category || ALL_PRODUCTS_CATEGORY);
  }

  return {
    products,
    filteredProducts,
    selectedCategory,
    changeCategory,
  };
}
