import { useEffect, useState } from 'react';

function getGalleryAnimationClass(category) {
  if (category === 'cozinha') {
    return 'flicker-in-2';
  }

  return '';
}

function AlbumGallery({ product, products = [], initialProductIndex = 0, onClose }) {
  const visibleProducts = products.length ? products : product ? [product] : [];
  const [selectedProductIndex, setSelectedProductIndex] = useState(initialProductIndex);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentProduct = visibleProducts[selectedProductIndex] || product;
  const selectedImage = currentProduct?.images[selectedImageIndex] || null;
  const imagesLength = currentProduct?.images.length || 0;
  const hasPreviousImage =
    selectedImageIndex !== null && (selectedProductIndex > 0 || selectedImageIndex > 0);
  const hasNextImage =
    selectedImageIndex !== null &&
    (selectedProductIndex < visibleProducts.length - 1 ||
      selectedImageIndex < imagesLength - 1);

  function showPreviousImage() {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex((currentIndex) => currentIndex - 1);
      return;
    }

    if (selectedProductIndex > 0) {
      const previousProduct = visibleProducts[selectedProductIndex - 1];
      setSelectedProductIndex((currentIndex) => currentIndex - 1);
      setSelectedImageIndex((previousProduct?.images.length || 1) - 1);
    }
  }

  function showNextImage() {
    if (selectedImageIndex < imagesLength - 1) {
      setSelectedImageIndex((currentIndex) => currentIndex + 1);
      return;
    }

    if (selectedProductIndex < visibleProducts.length - 1) {
      setSelectedProductIndex((currentIndex) => currentIndex + 1);
      setSelectedImageIndex(0);
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setSelectedImageIndex(null);
      }

      if (event.key === 'ArrowLeft' && hasPreviousImage) {
        showPreviousImage();
      }

      if (event.key === 'ArrowRight' && hasNextImage) {
        showNextImage();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasNextImage, hasPreviousImage, imagesLength, selectedImageIndex, selectedProductIndex]);

  if (!product) {
    return null;
  }

  const galleryAnimationClass = getGalleryAnimationClass(product.category);

  function openProductImage(productIndex, imageIndex = 0) {
    setSelectedProductIndex(productIndex);
    setSelectedImageIndex(imageIndex);
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      setSelectedImageIndex(null);
      onClose();
    }
  }

  function handleViewerBackdropClick(event) {
    if (event.target === event.currentTarget) {
      setSelectedImageIndex(null);
    }
  }

  return (
    <section
      className="album-gallery-overlay"
      aria-label={`Galeria do album ${product.title || product.categoryLabel}`}
      onClick={handleBackdropClick}
    >
      <div className="album-gallery-panel" role="dialog" aria-modal="true">
        <div className="album-gallery-panel__header">
          <div>
            <span className="album-gallery-panel__eyebrow">Galeria</span>
            <h2 className="album-gallery-panel__title">
              {product.title || product.categoryLabel}
            </h2>
          </div>

          <button
            className="album-gallery-panel__close"
            type="button"
            aria-label="Fechar galeria"
            onClick={() => {
              setSelectedImageIndex(null);
              onClose();
            }}
          >
            X
          </button>
        </div>

        <div className="album-gallery" aria-label={`Fotos do album ${product.categoryLabel}`}>
          {visibleProducts.map((galleryProduct, productIndex) =>
            galleryProduct.images.map((image, imageIndex) => (
              <figure
                className={`album-gallery__item ${galleryAnimationClass}`}
                key={`${galleryProduct.id}-${image.src}`}
                style={{ animationDelay: `${productIndex * 0.08}s` }}
              >
                <button
                  className="album-gallery__photo-button"
                  type="button"
                  onClick={() => openProductImage(productIndex, imageIndex)}
                >
                  <img
                    className="album-gallery__image"
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                  />
                </button>
                <figcaption className="album-gallery__caption">
                  {image.description}
                </figcaption>
              </figure>
            )),
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          className="album-photo-viewer"
          aria-label={`Foto expandida ${selectedProductIndex + 1} de ${visibleProducts.length}`}
          onClick={handleViewerBackdropClick}
        >
          <div className="album-photo-viewer__content">
            <button
              className="album-photo-viewer__close"
              type="button"
              aria-label="Fechar foto expandida"
              onClick={() => setSelectedImageIndex(null)}
            >
              X
            </button>

            {hasPreviousImage && (
              <button
                className="album-photo-viewer__arrow album-photo-viewer__arrow--prev"
                type="button"
                aria-label="Ver foto anterior"
                onClick={showPreviousImage}
              >
                &lsaquo;
              </button>
            )}

            <img
              className="album-photo-viewer__image album-photo-viewer__image--vertical"
              src={selectedImage.src}
              alt={`${selectedImage.alt} ampliada`}
            />

            <p className="album-photo-viewer__caption">{selectedImage.description}</p>

            {hasNextImage && (
              <button
                className="album-photo-viewer__arrow album-photo-viewer__arrow--next"
                type="button"
                aria-label="Ver proxima foto"
                onClick={showNextImage}
              >
                &rsaquo;
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default AlbumGallery;
