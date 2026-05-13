function ProjectCard({ product, onGalleryToggle }) {
  return (
    <article className="project-card puff-in-center">
      <div className="project-card__media" onClick={onGalleryToggle} style={{ cursor: 'pointer' }}>
        <img
          className="project-card__image"
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
        />
      </div>
      <div className="project-card__body">
        <p className="project-card__description">{product.description}</p>
      </div>
    </article>
  );
}

export default ProjectCard;
