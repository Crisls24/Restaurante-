import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const successMessage = location.state?.message;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await apiLogin(form);
      loginUser(result.access_token, result.usuario);
      if (result.usuario.rol === 'admin' || result.usuario.rol === 'mesero' || result.usuario.rol === 'cocina') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card form-card">
        <p className="section-label" style={{ textAlign: 'center' }}>Panel de Empleados</p>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, textAlign: 'center', marginBottom: '0.3rem' }}>
          Iniciar Sesión
        </h2>
        <p className="subtitle">Acceso exclusivo para el equipo de Xiú</p>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Tu contraseña" required />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ¿Eres cliente? <a href="/reservation" style={{ color: 'var(--gold-bright)', textDecoration: 'none' }}>Reserva tu mesa aquí</a>
        </p>
      </div>
    </div>
  );
}
