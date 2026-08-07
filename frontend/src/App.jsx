import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import MyReservations from './pages/MyReservations';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminMenu from './pages/AdminMenu';
import TableBoard from './pages/TableBoard';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/"                element={<Home />} />
            <Route path="/login"           element={<Login />} />
            <Route path="/register"        element={<Register />} />
            <Route path="/menu"            element={<Menu />} />
            <Route path="/reservation"     element={<Reservation />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="/dashboard"       element={<Dashboard />} />
            <Route path="/profile"         element={<Profile />} />
            <Route path="/admin/menu"      element={<AdminMenu />} />
            <Route path="/tableboard"      element={<TableBoard />} />
            <Route path="/reports"         element={<Reports />} />
          </Routes>
          <footer className="footer">
            <div className="footer-content">
              <div>
                <div className="footer-brand">Xiú</div>
                <p className="footer-tagline">Alta Cocina Mexicana</p>
              </div>
              <div>
                <h4>Horario</h4>
                <p>
                  Martes — Domingo<br />
                  13:00 — 16:00 · 19:00 — 23:00<br />
                  Cerrado los lunes
                </p>
              </div>
              <div>
                <h4>Contacto</h4>
                <p>
                  Av. Insurgentes Sur 1234<br />
                  Col. Del Valle, CDMX<br />
                  +52 55 1234 5678<br />
                  <a href="mailto:reservaciones@xiu.mx">reservaciones@xiu.mx</a><br />
                  <a href="https://instagram.com/xiu.mx" target="_blank" rel="noopener noreferrer">@xiu.mx</a>
                </p>
              </div>
            </div>
            <div className="footer-bottom">
              &copy; 2026 Xiú — Arquitectura Orientada a Servicios
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
