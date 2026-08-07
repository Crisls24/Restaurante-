import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar menú móvil al navegar
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isHome    = location.pathname === '/';
  const navClass  = `navbar ${isHome && !scrolled ? 'transparent' : 'solid'}`;

  const rol       = user?.rol;
  const isAdmin   = rol === 'admin';
  const isEmployee= isAuthenticated && rol !== 'cliente';
  const isCliente = isAuthenticated && rol === 'cliente';

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className={navClass}>
      <Link to="/" className="nav-brand">Xiú</Link>

      {/* Botón hamburguesa móvil */}
      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menú"
      >
        <span /><span /><span />
      </button>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/"    className="nav-link">Inicio</Link>
        <Link to="/menu" className="nav-link">Menú</Link>

        {/* Cliente autenticado */}
        {isCliente && (
          <>
            <Link to="/my-reservations" className="nav-link">Mis Reservas</Link>
            <Link to="/profile"         className="nav-link">Perfil</Link>
            <button className="btn-logout" onClick={handleLogout}>Salir</button>
          </>
        )}

        {/* Empleado / Admin autenticado */}
        {isEmployee && (
          <>
            <Link to="/dashboard"  className="nav-link">Reservaciones del día</Link>
            <Link to="/tableboard" className="nav-link">Tablero</Link>
            {isAdmin && (
              <>
                <Link to="/admin/menu" className="nav-link">Admin Menú</Link>
                <Link to="/reports"    className="nav-link">Reportes</Link>
              </>
            )}
            <Link to="/profile" className="nav-link">Perfil</Link>
            <button className="btn-logout" onClick={handleLogout}>Salir</button>
          </>
        )}

        {/* No autenticado */}
        {!isAuthenticated && (
          <>
            <Link to="/login"       className="nav-link">Staff</Link>
            <Link to="/reservation" className="btn-nav">Reservar</Link>
          </>
        )}
      </div>
    </nav>
  );
}
