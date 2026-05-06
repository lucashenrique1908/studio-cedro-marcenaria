import { FOOTER_CONTENT } from '../../data/pageContent.js';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <p>{FOOTER_CONTENT.copy}</p>
        <p>{FOOTER_CONTENT.tagline}</p>
      </div>
    </footer>
  );
}

export default Footer;
