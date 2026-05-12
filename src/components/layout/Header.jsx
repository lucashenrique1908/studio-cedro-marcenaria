import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../data/navigation.js';

function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <NavLink to="/" className="brand" end>
          Studio Cedro Marcenaria
        </NavLink>

        <nav aria-label="Navegacao principal" className="main-nav">
          <ul>
            {NAV_LINKS.filter(link => !['/contato', '/admin'].includes(link.path)).map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? 'nav-link nav-link-active tracking-in-expand'
                      : 'nav-link tracking-in-expand'
                  }
                  end={link.path === '/'}
                >
                  {link.label === 'Servicos' ? 'Serviços' : link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
