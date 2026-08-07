import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getReservations, cancelReservation } from '../services/api';

const STATUS_COLORS = {
  Pendiente:  { bg: '#2A2218', border: '#C9A96E', text: '#C9A96E' },
  Confirmada: { bg: '#1A2A18', border: '#5B8C5A', text: '#8FBF6A' },
  Cancelada:  { bg: '#2A1612', border: '#C0543A', text: '#D4654A' },
  Completada: { bg: '#1A1E2A', border: '#5A7ABF', text: '#7A9ADF' },
};

const FILTERS = ['Todas', 'Pendiente', 'Confirmada', 'Completada', 'Cancelada'];

export default function MyReservations() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [filter, setFilter]             = useState('Todas');
  const [cancelling, setCancelling]     = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    load();
  }, [isAuthenticated]);

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

  async function handleCancel(id) {
    if (!confirm('¿Estás seguro de cancelar esta reservación? Esta acción no se puede deshacer.')) return;
    setCancelling(id);
    try {
      await cancelReservation(id);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(null);
    }
  }

  const filtered = filter === 'Todas'
    ? reservations
    : reservations.filter((r) => (r.estado?.nombre || r.estado) === filter);

  const counts = FILTERS.slice(1).reduce((acc, f) => {
    acc[f] = reservations.filter((r) => (r.estado?.nombre || r.estado) === f).length;
    return acc;
  }, {});

  return (
    <main className="container" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p className="section-label">Mi cuenta</p>
        <h1 className="page-title">Mis Reservaciones</h1>
        <div className="divider-left" />
      </div>

      {/* Tarjetas resumen */}
      <div className="my-res-summary">
        {FILTERS.slice(1).map((f) => {
          const s = STATUS_COLORS[f];
          return (
            <button
              key={f}
              className={`my-res-stat-card ${filter === f ? 'active' : ''}`}
              style={{ borderColor: filter === f ? s.border : 'var(--border)', color: filter === f ? s.text : 'var(--text-muted)' }}
              onClick={() => setFilter(f)}
            >
              <span className="my-res-stat-num" style={{ color: s.text }}>{counts[f] || 0}</span>
              <span className="my-res-stat-label">{f}</span>
            </button>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="dashboard-filters" style={{ marginBottom: '2rem' }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} {f !== 'Todas' && counts[f] > 0 && <span className="filter-badge">{counts[f]}</span>}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="shimmer" style={{ width: '100%', height: '80px', borderRadius: '8px', marginBottom: '1rem' }} />
          <div className="shimmer" style={{ width: '100%', height: '80px', borderRadius: '8px', marginBottom: '1rem' }} />
          <div className="shimmer" style={{ width: '70%', height: '80px', borderRadius: '8px' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <p className="empty-state-title">
            {filter === 'Todas' ? 'Sin reservaciones' : `Sin reservaciones ${filter.toLowerCase()}s`}
          </p>
          <p className="empty-state-sub">
            {filter === 'Todas'
              ? 'Aún no tienes reservaciones. ¡Haz tu primera reserva!'
              : 'No hay reservaciones con este estado.'}
          </p>
          {filter === 'Todas' && (
            <button className="btn btn-gold" onClick={() => navigate('/reservation')} style={{ marginTop: '1.5rem' }}>
              Reservar una mesa
            </button>
          )}
        </div>
      ) : (
        <div className="reservations-list">
          {filtered.map((r) => {
            const estadoNombre = r.estado?.nombre || r.estado || 'Pendiente';
            const s = STATUS_COLORS[estadoNombre] || STATUS_COLORS.Pendiente;
            const canCancel = estadoNombre === 'Pendiente' || estadoNombre === 'Confirmada';
            return (
              <div className="reservation-card" key={r.id_reservacion} style={{ animation: 'fadeInUp 0.4s ease both' }}>
                <div className="reservation-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span className="reservation-id">#{r.id_reservacion}</span>
                    <span
                      className="reservation-status"
                      style={{ background: s.bg, borderColor: s.border, color: s.text }}
                    >
                      {estadoNombre}
                    </span>
                  </div>
                  <span className="reservation-date">{r.fecha} · {r.hora_inicio}</span>
                </div>

                <div className="reservation-body">
                  <div className="reservation-info">
                    <div className="reservation-info-item">
                      <span className="reservation-info-label">Nombre</span>
                      <span className="reservation-info-value">{r.cliente_nombre}</span>
                    </div>
                    <div className="reservation-info-item">
                      <span className="reservation-info-label">Mesa</span>
                      <span className="reservation-info-value">
                        {r.mesa?.numero ? `Mesa ${r.mesa.numero} (${r.mesa.ubicacion})` : r.mesa_asignada || '—'}
                      </span>
                    </div>
                    <div className="reservation-info-item">
                      <span className="reservation-info-label">Personas</span>
                      <span className="reservation-info-value">{r.num_personas}</span>
                    </div>
                    {r.notas && (
                      <div className="reservation-info-item">
                        <span className="reservation-info-label">Notas</span>
                        <span className="reservation-info-value">{r.notas}</span>
                      </div>
                    )}
                  </div>
                </div>

                {canCancel && (
                  <div className="reservation-actions">
                    <button
                      className="btn btn-secondary"
                      style={{ borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: '0.75rem', padding: '0.5rem 1.2rem' }}
                      onClick={() => handleCancel(r.id_reservacion)}
                      disabled={cancelling === r.id_reservacion}
                    >
                      {cancelling === r.id_reservacion ? 'Cancelando...' : '✕ Cancelar reservación'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
