import { useEffect, useMemo, useState } from 'react';
import { SERVICES_PAGE } from '../data/pageContent.js';
import { products } from '../data/products.js';

function Services() {
  const specialDesigns = useMemo(
    () => products.filter((product) => product.category === 'design-especial'),
    [],
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeDesign = specialDesigns[activeImageIndex];

  useEffect(() => {
    if (specialDesigns.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveImageIndex((currentIndex) => (currentIndex + 1) % specialDesigns.length);
    }, 2600);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [specialDesigns.length]);

  return (
    <section className="page services-page">
      <div className="container page-content">
        <span className="page-eyebrow">{SERVICES_PAGE.eyebrow}</span>
        <h1 className="tracking-in-expand">{SERVICES_PAGE.title}</h1>
        <p>{SERVICES_PAGE.description}</p>
      </div>

      {activeDesign && (
        <div className="container services-photo-stage color-change-5x">
          <img
            className="services-photo-stage__image"
            src={activeDesign.thumbnail}
            alt={activeDesign.description}
          />
          <div className="services-photo-stage__content">
            <span className="page-eyebrow">Designs especiais</span>
            <h2>Inspirações em movimento</h2>
            <p>{activeDesign.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}

export default Services;
