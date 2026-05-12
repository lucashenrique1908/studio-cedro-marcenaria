import { useEffect, useMemo, useState } from 'react';
import AlbumGallery from '../components/AlbumGallery';
import FilterBar from '../components/FilterBar';
import ProjectCard from '../components/ProjectCard';
import { useProducts } from '../hooks/useProducts';

function Projects() {
  const { filteredProducts, selectedCategory, changeCategory } = useProducts();
  const [openGalleryId, setOpenGalleryId] = useState(null);
  const openGalleryProduct = useMemo(
    () => filteredProducts.find((product) => product.id === openGalleryId),
    [filteredProducts, openGalleryId],
  );
  const openGalleryIndex = useMemo(
    () => filteredProducts.findIndex((product) => product.id === openGalleryId),
    [filteredProducts, openGalleryId],
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpenGalleryId(null);
      }
    }

    if (openGalleryId) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('body-gallery-open');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('body-gallery-open');
    };
  }, [openGalleryId]);

  function handleCategoryChange(category) {
    setOpenGalleryId(null);
    changeCategory(category);
  }

  function handleGalleryToggle(productId) {
    setOpenGalleryId((currentId) => (currentId === productId ? null : productId));
  }

  return (
    <main className="projects-page">
      <section className="projects-page__header">
        <span className="projects-page__eyebrow">Projetos</span>
        <h1 className="projects-page__title tracking-in-expand">
          <span style={{ display: 'block', marginBottom: '0.5em' }}>Móveis planejados</span>
          <span style={{ display: 'block', marginTop: '0.5em' }}>para cada ambiente</span>
        </h1>
      </section>

      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <section className="projects-page__grid" aria-label="Lista de projetos">
        {filteredProducts.map((product) => (
          <ProjectCard
            key={product.id}
            product={product}
            isGalleryOpen={openGalleryId === product.id}
            onGalleryToggle={() => handleGalleryToggle(product.id)}
          />
        ))}
      </section>

      <AlbumGallery
        key={openGalleryProduct?.id || 'closed-gallery'}
        product={openGalleryProduct}
        products={filteredProducts}
        initialProductIndex={openGalleryIndex >= 0 ? openGalleryIndex : 0}
        onClose={() => setOpenGalleryId(null)}
      />
    </main>
  );
}

export default Projects;
