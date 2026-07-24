import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useScrollReveal from '../hooks/useScrollReveal';

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
  const sectionRef = useScrollReveal();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={sectionRef}>
      {/* ── Hero ── */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{ transform: `translateY(${scrollY * 0.15}px) scale(1.1)` }}
        />
        <div
          className="hero-content"
          style={{
            transform: `translateY(${scrollY * 0.1}px)`,
            opacity: Math.max(0, 1 - scrollY / 600)
          }}
        >
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
          <p className="section-label reveal">Nuestra Filosofía</p>
          <h2 className="section-title reveal reveal-delay-1">Tradición y Vanguardia</h2>
          <div className="divider-center reveal reveal-delay-2" />
          <p className="philosophy-text reveal reveal-delay-3">
            En Xiú, cada platillo es un diálogo entre la cocina tradicional mexicana
            y las técnicas contemporáneas. Seleccionamos ingredientes de origen local
            para crear experiencias que despiertan los sentidos.
          </p>
          <div className="gold-line reveal reveal-delay-4" style={{ marginTop: '2.5rem' }}><span>◆</span></div>
          <p className="philosophy-author reveal reveal-delay-5">— Chef Executive</p>
        </div>
      </section>

      {/* ── Menú Destacado ── */}
      <section className="section">
        <div className="section-center">
          <p className="section-label reveal">Selección del Chef</p>
          <h2 className="section-title reveal reveal-delay-1">Platillos Destacados</h2>
          <div className="divider-center reveal reveal-delay-2" />
        </div>
        <div className="featured-grid">
          {DISHES.map((dish, i) => (
            <div className={`featured-item reveal reveal-delay-${(i % 3) + 1}`} key={i}>
              <div className="featured-img" style={{ backgroundImage: `url(${dish.img})` }} />
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
        <div style={{ textAlign: 'center', marginTop: '3.5rem' }} className="reveal">
          <Link to="/menu" className="btn btn-outline">Ver Menú Completo</Link>
        </div>
      </section>

      {/* ── Galería ── */}
      <section className="section-full" style={{ background: 'var(--bg-warm)', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 3rem' }}>
          <div className="section-center">
            <p className="section-label reveal">Ambiente</p>
            <h2 className="section-title reveal reveal-delay-1">Nuestro Espacio</h2>
            <div className="divider-center reveal reveal-delay-2" />
          </div>
          <div className="gallery-grid">
            {GALLERY.map((item, i) => (
              <div
                className={`gallery-item reveal-scale reveal-delay-${(i % 3) + 1} ${i === 0 || i === 4 ? 'wide' : ''}`}
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
            <p className="section-label reveal">Experiencia Personalizada</p>
            <h2 className="section-title reveal reveal-delay-1" style={{ color: '#fff' }}>Reserva Tu Mesa</h2>
            <div className="divider-center reveal reveal-delay-2" />
            <p className="section-subtitle reveal reveal-delay-3" style={{ margin: '0 auto 2rem', color: 'rgba(255,255,255,0.6)' }}>
              Asegura tu lugar en una experiencia gastronómica inolvidable.
              Nuestro equipo preparará todo para tu visita.
            </p>
            <div className="reveal reveal-delay-4">
              <Link to="/reservation" className="btn btn-gold">Reservar Ahora</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ubicación ── */}
      <section className="section" style={{ background: 'var(--bg)' }}>
        <div className="section-center">
          <p className="section-label reveal">Visítanos</p>
          <h2 className="section-title reveal reveal-delay-1">Encuéntranos</h2>
          <div className="divider-center reveal reveal-delay-2" />
        </div>
        <div className="location-grid">
          <div className="location-info reveal-left">
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
          <div className="location-map reveal-right">Mapa</div>
        </div>
      </section>
    </div>
  );
}
