import { categories } from '../data/categories';

function FilterBar({ selectedCategory, onCategoryChange }) {
  return (
    <div className="filter-bar" role="tablist" aria-label="Filtrar projetos">
      {categories.map((category) => {
        const isSelected = category.id === selectedCategory;

        return (
          <button
            className={`filter-bar__button${isSelected ? ' filter-bar__button--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isSelected}
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterBar;
