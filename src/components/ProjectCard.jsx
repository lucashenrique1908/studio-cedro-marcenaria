function ProjectCard({ product, isGalleryOpen, onGalleryToggle }) {
  return (
    <article className="project-card puff-in-center">
      <div className="project-card__media">
        <img
          className="project-card__image"
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
        />
        <span className="project-card__badge">{product.images.length} imagens</span>
      </div>

      <div className="project-card__body">
        <span className="project-card__category">{product.category}</span>
        <h3 className="project-card__title">{product.title}</h3>
        <p className="project-card__description">{product.description}</p>

        <ul className="project-card__features">
          {product.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <button
          className="project-card__button"
          type="button"
          aria-expanded={isGalleryOpen}
          onClick={onGalleryToggle}
        >
          {isGalleryOpen ? 'Fechar Fotos' : 'Ver Fotos'}
        </button>
      </div>
    </article>
  );
}

export default ProjectCard;
