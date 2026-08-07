import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTodayReservations } from '../services/api';

// 12 mesas fijas del restaurante Xiú
const TOTAL_TABLES = 12;
const LOCATIONS = { 1: 'Terraza', 2: 'Interior', 3: 'Barra', 4: 'VIP' };

function buildTables(todayReservations) {
  return Array.from({ length: TOTAL_TABLES }, (_, i) => {
    const num = i + 1;
    const location = LOCATIONS[Math.ceil(num / 3)] || 'Interior';
    const res = todayReservations.find(
      (r) => (r.mesa?.numero === num || r.mesa_asignada === num) &&
              (r.estado?.nombre || r.estado) !== 'Cancelada'
    );
    return {
      numero: num,
      ubicacion: location,
      capacidad: num <= 4 ? 2 : num <= 8 ? 4 : 6,
      estado: res
        ? (r => r === 'Confirmada' || r === 'Pendiente' ? 'Reservada' : 'Ocupada')(res.estado?.nombre || res.estado)
        : 'Libre',
      reservacion: res || null,
    };
  });
}

const TABLE_STYLES = {
  Libre:    { bg: '#1A2A18', border: '#5B8C5A', text: '#8FBF6A', icon: '○' },
  Reservada:{ bg: '#2A2218', border: '#C9A96E', text: '#C9A96E', icon: '◑' },
  Ocupada:  { bg: '#2A1612', border: '#C0543A', text: '#D4654A', icon: '●' },
};

export default function TableBoard() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [selected, setSelected]       = useState(null);
  const [overrides, setOverrides]     = useState({});
  const [lastUpdate, setLastUpdate]   = useState(new Date());

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.rol !== 'admin' && user?.rol !== 'mesero') { navigate('/'); return; }
    load();
  }, [isAuthenticated, user]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await getTodayReservations();
      const base = buildTables(Array.isArray(res) ? res : []);
      // Apply manual overrides
      const withOverrides = base.map((t) =>
        overrides[t.numero] ? { ...t, estado: overrides[t.numero] } : t
      );
      setTables(withOverrides);
      setLastUpdate(new Date());
    } catch {
      // If API fails, show empty tables
      setTables(buildTables([]));
    } finally {
      setLoading(false);
    }
  }

  function changeTableState(numero, newEstado) {
    setOverrides((prev) => ({ ...prev, [numero]: newEstado }));
    setTables((prev) =>
      prev.map((t) => t.numero === numero ? { ...t, estado: newEstado } : t)
    );
    setSelected(null);
  }

  const counts = {
    Libre:    tables.filter((t) => t.estado === 'Libre').length,
    Reservada:tables.filter((t) => t.estado === 'Reservada').length,
    Ocupada:  tables.filter((t) => t.estado === 'Ocupada').length,
  };

  return (
    <main className="container" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="section-label">Panel de empleados</p>
          <h1 className="page-title">Tablero de Mesas</h1>
          <div className="divider-left" />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.4rem' }}>
            Actualizado: {lastUpdate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={load} disabled={loading}>
          {loading ? 'Actualizando…' : '↻ Actualizar'}
        </button>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Leyenda + stats */}
      <div className="tableboard-legend">
        {Object.entries(TABLE_STYLES).map(([estado, s]) => (
          <div className="legend-item" key={estado}>
            <span className="legend-dot" style={{ background: s.border }} />
            <span>{estado}</span>
            <span className="legend-count" style={{ color: s.text }}>{counts[estado]}</span>
          </div>
        ))}
        <div className="legend-item" style={{ marginLeft: 'auto' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            {TOTAL_TABLES} mesas · {counts.Libre} libres hoy
          </span>
        </div>
      </div>

      {/* Grid de mesas */}
      {loading ? (
        <div className="tableboard-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="shimmer" style={{ height: '120px', borderRadius: '10px' }} />
          ))}
        </div>
      ) : (
        <div className="tableboard-grid">
          {tables.map((table) => {
            const s = TABLE_STYLES[table.estado];
            const isSelected = selected?.numero === table.numero;
            return (
              <div
                key={table.numero}
                className={`table-card ${isSelected ? 'selected' : ''}`}
                style={{ background: s.bg, borderColor: isSelected ? s.text : s.border }}
                onClick={() => setSelected(isSelected ? null : table)}
              >
                <div className="table-icon" style={{ color: s.text }}>{s.icon}</div>
                <div className="table-number">Mesa {table.numero}</div>
                <div className="table-location">{table.ubicacion}</div>
                <div className="table-capacity">👥 {table.capacidad} personas</div>
                <span className="table-status-badge" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.text }}>
                  {table.estado}
                </span>

                {table.reservacion && (
                  <div className="table-reservation-info">
                    <span>🕐 {table.reservacion.hora_inicio}</span>
                    <span>{table.reservacion.cliente_nombre}</span>
                  </div>
                )}

                {/* Panel de acciones inline */}
                {isSelected && (
                  <div className="table-actions" onClick={(e) => e.stopPropagation()}>
                    {['Libre', 'Reservada', 'Ocupada']
                      .filter((s) => s !== table.estado)
                      .map((newState) => (
                        <button
                          key={newState}
                          className="btn-table-action"
                          style={{ borderColor: TABLE_STYLES[newState].border, color: TABLE_STYLES[newState].text }}
                          onClick={() => changeTableState(table.numero, newState)}
                        >
                          → {newState}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '2rem' }}>
        Haz clic en una mesa para cambiar su estado manualmente
      </p>
    </main>
  );
}
