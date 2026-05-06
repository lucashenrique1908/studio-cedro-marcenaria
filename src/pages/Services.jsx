import { SERVICES_PAGE } from '../data/pageContent.js';

function Services() {
  return (
    <section className="page">
      <div className="container page-content">
        <span className="page-eyebrow">{SERVICES_PAGE.eyebrow}</span>
        <h1 className="tracking-in-expand">{SERVICES_PAGE.title}</h1>
        <p>{SERVICES_PAGE.description}</p>
      </div>
    </section>
  );
}

export default Services;
