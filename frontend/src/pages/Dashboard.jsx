import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTodayReservations, getReservations, updateReservationStatus, cancelReservation } from '../services/api';

const STATUS_COLORS = {
  'Pendiente': { bg: '#2A2218', border: '#C9A96E', text: '#C9A96E' },
  'Confirmada': { bg: '#1A2A18', border: '#5B8C5A', text: '#8FBF6A' },
  'Cancelada': { bg: '#2A1612', border: '#C0543A', text: '#D4654A' },
  'Completada': { bg: '#1A1E2A', border: '#5A7ABF', text: '#7A9ADF' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('today');

  useEffect(() => { loadReservations(); }, [filter]);

  async function loadReservations() {
    setLoading(true);
    try {
      const data = filter === 'today' ? await getTodayReservations() : await getReservations();
      setReservations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id, newStatus) {
    try {
      await updateReservationStatus(id, newStatus);
      loadReservations();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCancel(id) {
    if (!confirm('¿Cancelar esta reservación?')) return;
    try {
      await cancelReservation(id);
      loadReservations();
    } catch (err) {
      setError(err.message);
    }
  }

  const rol = user?.rol;
  const canEdit = rol === 'admin' || rol === 'mesero';
  const canDelete = rol === 'admin';

  return (
    <main className="container">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Panel</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
            {user?.nombre} · <span style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>{rol}</span>
          </p>
        </div>
        <button className="btn btn-secondary" onClick={logout}>Salir</button>
      </div>

      <div className="dashboard-filters">
        <button
          className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
          onClick={() => setFilter('today')}
        >
          Hoy
        </button>
        {(rol === 'admin' || rol === 'mesero') && (
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Cargando reservaciones...</div>
      ) : reservations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Sin reservaciones</p>
          <p style={{ fontSize: '0.85rem' }}>{filter === 'today' ? 'No hay reservaciones para hoy' : 'No hay reservaciones registradas'}</p>
        </div>
      ) : (
        <div className="reservations-list">
          {reservations.map((r) => {
            const statusStyle = STATUS_COLORS[r.estado?.nombre] || STATUS_COLORS['Pendiente'];
            return (
              <div className="reservation-card" key={r.id_reservacion}>
                <div className="reservation-header">
                  <div>
                    <span className="reservation-id">#{r.id_reservacion}</span>
                    <span
                      className="reservation-status"
                      style={{
                        background: statusStyle.bg,
                        borderColor: statusStyle.border,
                        color: statusStyle.text,
                      }}
                    >
                      {r.estado?.nombre || 'Pendiente'}
                    </span>
                  </div>
                  <span className="reservation-date">{r.fecha} · {r.hora_inicio}</span>
                </div>

                <div className="reservation-body">
                  <div className="reservation-info">
                    <div className="reservation-info-item">
                      <span className="reservation-info-label">Cliente</span>
                      <span className="reservation-info-value">{r.cliente_nombre}</span>
                    </div>
                    <div className="reservation-info-item">
                      <span className="reservation-info-label">Teléfono</span>
                      <span className="reservation-info-value">{r.cliente_telefono}</span>
                    </div>
                    <div className="reservation-info-item">
                      <span className="reservation-info-label">Mesa</span>
                      <span className="reservation-info-value">{r.mesa?.numero} ({r.mesa?.ubicacion})</span>
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

                {canEdit && (
                  <div className="reservation-actions">
                    {r.estado?.nombre === 'Pendiente' && (
                      <>
                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }} onClick={() => handleStatusChange(r.id_reservacion, 'Confirmada')}>
                          Confirmar
                        </button>
                        <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }} onClick={() => handleStatusChange(r.id_reservacion, 'Completada')}>
                          Completada
                        </button>
                      </>
                    )}
                    {r.estado?.nombre === 'Confirmada' && (
                      <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }} onClick={() => handleStatusChange(r.id_reservacion, 'Completada')}>
                        Completada
                      </button>
                    )}
                    {canDelete && (
                      <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', borderColor: 'var(--accent)', color: 'var(--accent)' }} onClick={() => handleCancel(r.id_reservacion)}>
                        Cancelar
                      </button>
                    )}
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
