import { useEffect, useState } from 'react';

function getGalleryAnimationClass(category) {
  if (category === 'general') {
    return 'slide-in-elliptic-top-fwd';
  }

  if (category === 'cozinha') {
    return 'flicker-in-2';
  }

  return '';
}

function AlbumGallery({ product, onClose }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const imagesLength = product?.images.length || 0;

  useEffect(() => {
    function handleKeyDown(event) {
      if (selectedImageIndex === null) {
        return;
      }

      if (event.key === 'Escape') {
        setSelectedImageIndex(null);
      }

      if (event.key === 'ArrowLeft' && selectedImageIndex > 0) {
        setSelectedImageIndex((currentIndex) => currentIndex - 1);
      }

      if (event.key === 'ArrowRight' && selectedImageIndex < imagesLength - 1) {
        setSelectedImageIndex((currentIndex) => currentIndex + 1);
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imagesLength, selectedImageIndex]);

  if (!product) {
    return null;
  }

  const galleryAnimationClass = getGalleryAnimationClass(product.category);
  const selectedImage =
    selectedImageIndex === null ? null : product.images[selectedImageIndex];
  const hasPreviousImage = selectedImageIndex > 0;
  const hasNextImage =
    selectedImageIndex !== null && selectedImageIndex < product.images.length - 1;

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
      aria-label={`Galeria do album ${product.title}`}
      onClick={handleBackdropClick}
    >
      <div className="album-gallery-panel" role="dialog" aria-modal="true">
        <div className="album-gallery-panel__header">
          <div>
            <span className="album-gallery-panel__eyebrow">Galeria</span>
            <h2 className="album-gallery-panel__title">{product.title}</h2>
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

        <div className="album-gallery" aria-label={`Fotos do album ${product.title}`}>
          {product.images.map((image, index) => (
            <figure
              className={`album-gallery__item ${galleryAnimationClass}`}
              key={`${product.id}-${image}`}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <button
                className="album-gallery__photo-button"
                type="button"
                onClick={() => setSelectedImageIndex(index)}
              >
                <img
                  className="album-gallery__image"
                  src={image}
                  alt={`${product.title} foto ${index + 1}`}
                  loading="lazy"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="album-photo-viewer"
          aria-label={`Foto expandida ${selectedImageIndex + 1} de ${product.images.length}`}
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
                onClick={() => setSelectedImageIndex((currentIndex) => currentIndex - 1)}
              >
                ‹
              </button>
            )}

            <img
              className="album-photo-viewer__image"
              src={selectedImage}
              alt={`${product.title} foto ${selectedImageIndex + 1} ampliada`}
            />

            {hasNextImage && (
              <button
                className="album-photo-viewer__arrow album-photo-viewer__arrow--next"
                type="button"
                aria-label="Ver proxima foto"
                onClick={() => setSelectedImageIndex((currentIndex) => currentIndex + 1)}
              >
                ›
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default AlbumGallery;
