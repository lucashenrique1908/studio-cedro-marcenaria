import { ADMIN_PAGE } from '../data/pageContent.js';

function Admin() {
  return (
    <section className="page">
      <div className="container page-content">
        <span className="page-eyebrow">{ADMIN_PAGE.eyebrow}</span>
        <h1 className="tracking-in-expand">{ADMIN_PAGE.title}</h1>
        <p>{ADMIN_PAGE.description}</p>
      </div>
    </section>
  );
}

export default Admin;
