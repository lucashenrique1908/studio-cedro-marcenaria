import { CONTACT_PAGE } from '../data/pageContent.js';

function Contact() {
  return (
    <section className="page">
      <div className="container page-content">
        <span className="page-eyebrow">{CONTACT_PAGE.eyebrow}</span>
        <h1 className="tracking-in-expand">{CONTACT_PAGE.title}</h1>
        <p>{CONTACT_PAGE.description}</p>
      </div>
    </section>
  );
}

export default Contact;
