import { useState, useEffect } from 'react';
import { getMenu } from '../services/api';
import MenuItem from '../components/MenuItem';

const CATEGORIES = ['all', 'Entrada', 'Platillo principal', 'Bebida', 'Postre'];
const CATEGORY_LABELS = { all: 'Todos', Entrada: 'Entradas', 'Platillo principal': 'Principales', Bebida: 'Bebidas', Postre: 'Postres' };

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('Cargando menú...');
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => { loadMenu(); }, []);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setLoadingMsg('El servicio está despertando, esto puede tomar un momento...'), 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  async function loadMenu() {
    try {
      const data = await getMenu();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = activeCategory === 'all' ? items : items.filter((i) => i.categoria === activeCategory);

  const grouped = filtered.reduce((acc, item) => {
    const cat = item.categoria;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const categoryOrder = ['Entrada', 'Platillo principal', 'Bebida', 'Postre'];

  return (
    <main className="menu-page">
      <div className="menu-header">
        <p className="section-label">Nuestra Carta</p>
        <h1 className="page-title">Menú</h1>
        <div className="divider-center" />
      </div>

      <div className="filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error" style={{ maxWidth: '700px', margin: '0 auto 1rem' }}>{error}</div>}

      {loading ? (
        <div className="loading">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="shimmer" style={{ width: '200px', height: '16px' }} />
            <div className="shimmer" style={{ width: '280px', height: '12px' }} />
            <div className="shimmer" style={{ width: '160px', height: '12px' }} />
            <p style={{ marginTop: '0.5rem' }}>{loadingMsg}</p>
          </div>
        </div>
      ) : (
        <div className="menu-list">
          {filtered.length > 0 ? (
            categoryOrder
              .filter((cat) => grouped[cat]?.length > 0)
              .map((cat) => (
                <div key={cat}>
                  <h3 className="menu-category-header">{CATEGORY_LABELS[cat] || cat}</h3>
                  {grouped[cat].map((item) => (
                    <MenuItem key={item._id} item={item} />
                  ))}
                </div>
              ))
          ) : (
            <div className="loading">No hay platillos en esta categoría</div>
          )}
        </div>
      )}
    </main>
  );
}
