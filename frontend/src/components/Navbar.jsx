import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = location.pathname === '/';
  const navClass = `navbar ${isHome && !scrolled ? 'transparent' : 'solid'}`;

  const isEmployee = isAuthenticated && user?.rol !== 'cliente';

  return (
    <nav className={navClass}>
      <Link to="/" className="nav-brand">Xiú</Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/menu" className="nav-link">Menú</Link>
        {isEmployee ? (
          <>
            <Link to="/dashboard" className="nav-link">Panel</Link>
            <button className="btn-logout" onClick={logout}>Salir</button>
          </>
        ) : isAuthenticated ? (
          <>
            <button className="btn-logout" onClick={logout}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Staff</Link>
            <Link to="/reservation" className="btn-nav">Reservar</Link>
          </>
        )}
      </div>
    </nav>
  );
}
