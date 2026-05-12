import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout.jsx';
import Home from '../pages/Home.jsx';
import Projects from '../pages/Projects.jsx';
import Services from '../pages/Services.jsx';
// import Contact from '../pages/Contact.jsx';
// import Admin from '../pages/Admin.jsx';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/projetos" element={<Projects />} />
        <Route path="/servicos" element={<Services />} />
        {/* <Route path="/contato" element={<Contact />} />
        <Route path="/admin" element={<Admin />} /> */}
      </Route>
    </Routes>
  );
}

export default AppRoutes;
