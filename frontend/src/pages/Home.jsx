import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Sistema de Reservaciones</h1>
          <p>Reserva tu mesa favorita en segundos. Consulta nuestro menu y recibe confirmacion al instante por WhatsApp.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Crear Cuenta</Link>
            <Link to="/menu" className="btn btn-outline">Ver Menu</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">&#128221;</div>
          <h3>Registro Rapido</h3>
          <p>Crea tu cuenta en segundos y empieza a reservar.</p>
          <span className="feature-tag">HU-01</span>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#127860;</div>
          <h3>Menu Digital</h3>
          <p>Consulta todos nuestros platillos con precios actualizados.</p>
          <span className="feature-tag">HU-02</span>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#128241;</div>
          <h3>Confirmacion Instantanea</h3>
          <p>Recibe tu confirmacion por WhatsApp o SMS al reservar.</p>
          <span className="feature-tag">HU-04</span>
        </div>
      </section>

      <section className="tech-section">
        <h2>Arquitectura del Sistema</h2>
        <div className="tech-grid">
          <div className="tech-card">
            <strong>auth-service</strong>
            <span>NestJS (TypeScript)</span>
            <small>Deploy: Railway ✓</small>
          </div>
          <div className="tech-card">
            <strong>menu-service</strong>
            <span>FastAPI (Python)</span>
            <small>Deploy: Render ✓</small>
          </div>
          <div className="tech-card">
            <strong>Base de Datos</strong>
            <span>MySQL + MongoDB</span>
            <small>Polyglot Persistence</small>
          </div>
          <div className="tech-card">
            <strong>Frontend</strong>
            <span>React (Vite)</span>
            <small>Deploy: Vercel ✓</small>
          </div>
        </div>
      </section>
    </>
  );
}
