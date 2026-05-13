import { SERVICE_AREA_CITIES } from '../data/serviceAreas.js';
import { SERVICES_PAGE } from '../data/pageContent.js';

function splitIntoColumns(items, columnCount) {
  const columnSize = Math.ceil(items.length / columnCount);

  return Array.from({ length: columnCount }, (_, index) =>
    items.slice(index * columnSize, (index + 1) * columnSize),
  );
}

function Services() {
  const cityColumns = splitIntoColumns(SERVICE_AREA_CITIES, 3);

  return (
    <section className="page services-page">
      <div className="container page-content services-catalog-list">
        <span className="page-eyebrow">{SERVICES_PAGE.eyebrow}</span>
        <h1>{SERVICES_PAGE.title}</h1>
        <ul>
          {SERVICES_PAGE.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>{SERVICES_PAGE.closing}</h3>
      </div>

      <div className="container page-content services-cities">
        <h2>Atendemos em todo o estado do Rio de Janeiro</h2>
        <div className="cities-columns">
          {cityColumns.map((column, columnIndex) => (
            <ul key={columnIndex}>
              {column.map((city) => (
                <li key={city}>{city}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
