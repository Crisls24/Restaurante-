import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const DISHES = [
  { name: 'Ceviche de Coliflor', desc: 'Leche de tigre, aguacate, chile de árbol', price: 185, category: 'Entradas' },
  { name: 'Tuna Tostada', desc: 'Atún fresco, chipotle, aguacate, pepino', price: 195, category: 'Entradas' },
  { name: 'Pato en Mole Negro', desc: 'Mole de Oaxaca, arroz rojo, plátano frito', price: 380, category: 'Platillos' },
  { name: 'Barramundi al Pastor', desc: 'Piña asada, cilantro, salsa verde suave', price: 340, category: 'Platillos' },
  { name: 'Costilla de Res Wagyu', desc: 'Salsa de tamarindo, puré de yuca, brócoli', price: 420, category: 'Platillos' },
];

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.15}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}>
          <div className="gold-line"><span>◆</span></div>
          <p className="hero-label">Alta Cocina Mexicana</p>
          <h1 className="hero-title">Xiú</h1>
          <p className="hero-tagline">Sabores que cuentan historias</p>
          <div className="hero-actions">
            <Link to="/menu" className="btn btn-primary">Explorar Menú</Link>
            <Link to="/register" className="btn btn-outline">Reservar Mesa</Link>
          </div>
        </div>
      </section>

      {/* ── Filosofía ── */}
      <section className="philosophy">
        <div className="section-center">
          <p className="section-label">Nuestra Filosofía</p>
          <h2 className="section-title">Tradición y Vanguardia</h2>
          <div className="divider-center" />
          <p className="philosophy-text">
            En Xiú, cada platillo es un dialogue entre la cocina tradicional mexicana
            y las técnicas contemporáneas. Seleccionamos ingredientes de origen local
            para crear experiencias que despiertan los sentidos.
          </p>
          <div className="gold-line" style={{ marginTop: '2rem' }}><span>◆</span></div>
          <p className="philosophy-author">— Chef Executive</p>
        </div>
      </section>

      {/* ── Menú Destacado ── */}
      <section className="section-rich section">
        <div className="section-center">
          <p className="section-label">Selección del Chef</p>
          <h2 className="section-title">Platillos Destacados</h2>
          <div className="divider-center" />
        </div>
        <div className="featured-grid">
          {DISHES.map((dish, i) => (
            <div className="featured-item" key={i}>
              <div className="featured-img">
                <span style={{ fontSize: '1.8rem', opacity: 0.4 }}>✦</span>
              </div>
              <div className="featured-body">
                <h3 className="featured-name">{dish.name}</h3>
                <p className="featured-desc">{dish.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="featured-price">${dish.price}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{dish.category.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link to="/menu" className="btn btn-outline">Ver Menú Completo</Link>
        </div>
      </section>

      {/* ── Galería ── */}
      <section className="section-full section-rich" style={{ background: 'transparent' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 3rem' }}>
          <div className="section-center">
            <p className="section-label">Ambiente</p>
            <h2 className="section-title">Nuestro Espacio</h2>
            <div className="divider-center" />
          </div>
          <div className="gallery-grid">
            <div className="gallery-item wide">Interior Principal</div>
            <div className="gallery-item">Barra de Coctelería</div>
            <div className="gallery-item">Terraza</div>
            <div className="gallery-item">Cocina Abierta</div>
            <div className="gallery-item wide">Salón Privado</div>
          </div>
        </div>
      </section>

      {/* ── Reservación ── */}
      <section className="reservation-section">
        <div className="section" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-center">
            <p className="section-label">Experiencia Personalizada</p>
            <h2 className="section-title">Reserva Tu Mesa</h2>
            <div className="divider-center" />
            <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>
              Asegura tu lugar en una experiencia gastronómica inolvidable.
              Nuestro equipo preparará todo para tu visita.
            </p>
            <Link to="/register" className="btn btn-gold">Crear Cuenta y Reservar</Link>
          </div>
        </div>
      </section>

      {/* ── Ubicación ── */}
      <section className="section-rich section">
        <div className="section-center">
          <p className="section-label">Visítanos</p>
          <h2 className="section-title">Encuéntranos</h2>
          <div className="divider-center" />
        </div>
        <div className="location-grid">
          <div className="location-info">
            <div className="location-block">
              <h4>Dirección</h4>
              <p>Av. Insurgentes Sur 1234<br />Col. Del Valle, CDMX 03100</p>
            </div>
            <div className="location-block">
              <h4>Horario</h4>
              <p>
                Martes a Domingo<br />
                13:00 — 16:00 hrs · 19:00 — 23:00 hrs<br />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cerrado los lunes</span>
              </p>
            </div>
            <div className="location-block">
              <h4>Contacto</h4>
              <p>
                Tel: +52 55 1234 5678<br />
                reservaciones@xiu.mx
              </p>
            </div>
          </div>
          <div className="location-map">Mapa</div>
        </div>
      </section>
    </>
  );
}
