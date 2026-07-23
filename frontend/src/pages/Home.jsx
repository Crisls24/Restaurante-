import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const DISHES = [
  {
    name: 'Ceviche de Coliflor',
    desc: 'Leche de tigre, aguacate, chile de árbol',
    price: 185,
    img: 'https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?w=600&q=80'
  },
  {
    name: 'Tuna Tostada',
    desc: 'Atún fresco, chipotle, aguacate, pepino',
    price: 195,
    img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80'
  },
  {
    name: 'Pato en Mole Negro',
    desc: 'Mole de Oaxaca, arroz rojo, plátano frito',
    price: 380,
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80'
  },
  {
    name: 'Barramundi al Pastor',
    desc: 'Piña asada, cilantro, salsa verde suave',
    price: 340,
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80'
  },
  {
    name: 'Costilla de Res Wagyu',
    desc: 'Salsa de tamarindo, puré de yuca, brócoli',
    price: 420,
    img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80'
  },
];

const GALLERY = [
  { label: 'Interior Principal', img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80' },
  { label: 'Barra de Coctelería', img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80' },
  { label: 'Terraza', img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&q=80' },
  { label: 'Cocina Abierta', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80' },
  { label: 'Salón Privado', img: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&q=80' },
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
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.12}px)`, opacity: Math.max(0, 1 - scrollY / 500) }}>
          <div className="gold-line"><span>◆</span></div>
          <p className="hero-label">Alta Cocina Mexicana</p>
          <h1 className="hero-title">Xiú</h1>
          <p className="hero-tagline">Sabores que cuentan historias</p>
          <div className="hero-actions">
            <Link to="/reservation" className="btn btn-gold">Reservar Mesa</Link>
            <Link to="/menu" className="btn btn-outline">Ver Menú</Link>
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
          <div className="gold-line" style={{ marginTop: '2.5rem' }}><span>◆</span></div>
          <p className="philosophy-author">— Chef Executive</p>
        </div>
      </section>

      {/* ── Menú Destacado ── */}
      <section className="section">
        <div className="section-center">
          <p className="section-label">Selección del Chef</p>
          <h2 className="section-title">Platillos Destacados</h2>
          <div className="divider-center" />
        </div>
        <div className="featured-grid">
          {DISHES.map((dish, i) => (
            <div className="featured-item" key={i}>
              <div className="featured-img" style={{ backgroundImage: `url(${dish.img})` }}>
              </div>
              <div className="featured-body">
                <h3 className="featured-name">{dish.name}</h3>
                <p className="featured-desc">{dish.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="featured-price">${dish.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
          <Link to="/menu" className="btn btn-outline">Ver Menú Completo</Link>
        </div>
      </section>

      {/* ── Galería ── */}
      <section className="section-full" style={{ background: 'var(--bg-warm)', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3rem' }}>
          <div className="section-center">
            <p className="section-label">Ambiente</p>
            <h2 className="section-title">Nuestro Espacio</h2>
            <div className="divider-center" />
          </div>
          <div className="gallery-grid">
            {GALLERY.map((item, i) => (
              <div
                className={`gallery-item ${i === 0 || i === 4 ? 'wide' : ''}`}
                key={i}
                style={{ backgroundImage: `url(${item.img})` }}
              >
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reservación CTA ── */}
      <section className="reservation-section">
        <div className="section" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="section-center">
            <p className="section-label">Experiencia Personalizada</p>
            <h2 className="section-title" style={{ color: '#fff' }}>Reserva Tu Mesa</h2>
            <div className="divider-center" />
            <p className="section-subtitle" style={{ margin: '0 auto 2rem', color: 'rgba(255,255,255,0.6)' }}>
              Asegura tu lugar en una experiencia gastronómica inolvidable.
              Nuestro equipo preparará todo para tu visita.
            </p>
            <Link to="/reservation" className="btn btn-gold">Reservar Ahora</Link>
          </div>
        </div>
      </section>

      {/* ── Ubicación ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
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
