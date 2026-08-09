import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getReservations } from '../services/api';

function calcStats(reservations) {
  const total = reservations.length;
  const getEstado = (r) => r.estado?.nombre || r.estado || 'Pendiente';
  const confirmadas  = reservations.filter((r) => getEstado(r) === 'Confirmada').length;
  const canceladas   = reservations.filter((r) => getEstado(r) === 'Cancelada').length;
  const completadas  = reservations.filter((r) => getEstado(r) === 'Completada').length;
  const pendientes   = reservations.filter((r) => getEstado(r) === 'Pendiente').length;
  const tasa         = total > 0 ? Math.round(((confirmadas + completadas) / total) * 100) : 0;

  // Métricas reales: solo reservaciones completadas (asistencia efectiva)
  const completadasRes = reservations.filter((r) => getEstado(r) === 'Completada');
  const atendidas      = completadasRes.reduce((acc, r) => acc + (r.num_personas || 2), 0);
  const TICKET_PROMEDIO = 350;
  const ingresos = completadasRes.reduce((acc, r) => acc + (r.num_personas || 2) * TICKET_PROMEDIO, 0);

  // Agrupación por fecha
  const byDate = reservations.reduce((acc, r) => {
    const d = r.fecha || '—';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
  const topDates = Object.entries(byDate)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Por categoría de hora
  const mañana  = reservations.filter((r) => r.hora_inicio < '16:00').length;
  const noche   = reservations.filter((r) => r.hora_inicio >= '19:00').length;

  return { total, confirmadas, canceladas, completadas, pendientes, tasa, atendidas, ingresos, topDates, mañana, noche };
}

const STATUS_COLORS = {
  Pendiente:  '#C9A96E',
  Confirmada: '#8FBF6A',
  Cancelada:  '#D4654A',
  Completada: '#7A9ADF',
};

export default function Reports() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [period, setPeriod]             = useState('all');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.rol !== 'admin') { navigate('/'); return; }
    load();
  }, [isAuthenticated, user]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Filtrar por periodo
  const now = new Date();
  const filtered = reservations.filter((r) => {
    if (period === 'all') return true;
    if (!r.fecha) return false;
    const d = new Date(r.fecha);
    if (period === '7d') return (now - d) / 86400000 <= 7;
    if (period === '30d') return (now - d) / 86400000 <= 30;
    return true;
  });

  const stats = calcStats(filtered);
  const getEstado = (r) => r.estado?.nombre || r.estado || 'Pendiente';

  const STAT_CARDS = [
    { label: 'Total reservaciones', value: stats.total, color: 'var(--gold)', icon: '📋' },
    { label: 'Confirmadas',         value: stats.confirmadas, color: '#8FBF6A', icon: '✅' },
    { label: 'Completadas',         value: stats.completadas, color: '#7A9ADF', icon: '🎯' },
    { label: 'Canceladas',          value: stats.canceladas,  color: '#D4654A', icon: '✕' },
    { label: 'Tasa de éxito',       value: `${stats.tasa}%`, color: 'var(--gold-bright)', icon: '📈' },
    { label: 'Personas atendidas',  value: stats.atendidas, color: '#8FBF6A', icon: '👥' },
    { label: 'Ingreso est.*',       value: `$${stats.ingresos.toLocaleString()}`, color: '#C9A96E', icon: '💰' },
  ];

  return (
    <main className="container" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="section-label">Administración</p>
          <h1 className="page-title">Reportes</h1>
          <div className="divider-left" />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[['all', 'Todo'], ['30d', '30 días'], ['7d', '7 días']].map(([v, l]) => (
            <button key={v} className={`filter-btn ${period === v ? 'active' : ''}`} onClick={() => setPeriod(v)}>{l}</button>
          ))}
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {loading ? (
        <div className="loading">Generando reporte...</div>
      ) : (
        <>
          {/* Tarjetas KPI */}
          <div className="reports-grid">
            {STAT_CARDS.map((s) => (
              <div className="report-kpi-card" key={s.label}>
                <span className="report-kpi-icon">{s.icon}</span>
                <span className="report-kpi-value" style={{ color: s.color }}>{s.value}</span>
                <span className="report-kpi-label">{s.label}</span>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.4rem' }}>
            * Ingreso estimado = reservaciones completadas × ticket promedio de $350 por comensal. El sistema aún no registra consumos individuales.
          </p>

          {/* Distribución por estado — barra visual */}
          <div className="card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, marginBottom: '1.5rem', fontSize: '1.2rem' }}>
              Distribución por estado
            </h3>
            {['Confirmada', 'Completada', 'Pendiente', 'Cancelada'].map((estado) => {
              const cnt = filtered.filter((r) => getEstado(r) === estado).length;
              const pct = stats.total > 0 ? (cnt / stats.total) * 100 : 0;
              return (
                <div key={estado} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{estado}</span>
                    <span style={{ fontSize: '0.85rem', color: STATUS_COLORS[estado] }}>{cnt} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: STATUS_COLORS[estado],
                      borderRadius: '4px',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Turnos */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌞</div>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--gold)' }}>{stats.mañana}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Turno comida (13-16h)</div>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌙</div>
              <div style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', color: 'var(--gold)' }}>{stats.noche}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Turno cena (19-23h)</div>
            </div>
          </div>

          {/* Tabla detallada */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '1.2rem' }}>
                Reservaciones recientes
              </h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{filtered.length} registros</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-menu-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Personas</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 20).map((r) => {
                    const estado = getEstado(r);
                    return (
                      <tr key={r.id_reservacion}>
                        <td style={{ color: 'var(--text-muted)' }}>#{r.id_reservacion}</td>
                        <td>{r.cliente_nombre}</td>
                        <td>{r.fecha}</td>
                        <td>{r.hora_inicio}</td>
                        <td>{r.num_personas}</td>
                        <td>
                          <span style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            border: `1px solid ${STATUS_COLORS[estado]}`,
                            color: STATUS_COLORS[estado],
                          }}>
                            {estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Sin registros para este periodo</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
