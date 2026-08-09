import { useState } from 'react';
import { createReservation } from '../services/api';

const WHATSAPP_NUMBER = '527711509246';

export default function Reservation() {
  const [form, setForm] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    num_personas: 2,
    notas: '',
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);

    try {
      if (!form.hora_fin) {
        const [h, m] = form.hora_inicio.split(':').map(Number);
        const endH = h + 2;
        form.hora_fin = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      }
      const result = await createReservation(form);
      setSuccess(result);
      setForm({
        cliente_nombre: '',
        cliente_telefono: '',
        cliente_email: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        num_personas: 2,
        notas: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openWhatsApp() {
    const msg = `Hola! Me gustaría reservar una mesa en Xiú.\n\nFecha: ${form.fecha || '(por definir)'}\nHora: ${form.hora_inicio || '(por definir)'}\nPersonas: ${form.num_personas}\nNombre: ${form.cliente_nombre || '(por definir)'}\n\n¡Gracias!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="page-center">
        <div className="card form-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--gold)' }}>✓</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 300, marginBottom: '0.5rem' }}>
            Reservación Confirmada
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Tu mesa {success.mesa_asignada} está reservada para el {success.fecha} a las {success.hora_inicio}.
          </p>
          <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Reservación #{success.id_reservacion}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mesa {success.mesa_asignada} · {success.num_personas} personas</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{success.mensaje}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setSuccess(null)} style={{ width: '100%' }}>
            Nueva Reservación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="card form-card">
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, textAlign: 'center', marginBottom: '0.3rem' }}>
          Reservar Mesa
        </h2>
        <p className="subtitle">Elige tu fecha y hora. Confirmación al instante.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" name="cliente_nombre" value={form.cliente_nombre} onChange={handleChange} placeholder="Tu nombre" required />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input type="tel" name="cliente_telefono" value={form.cliente_telefono} onChange={handleChange} placeholder="771 234 5678" required />
            </div>
          </div>

          <div className="form-group">
            <label>Email (opcional)</label>
            <input type="email" name="cliente_email" value={form.cliente_email} onChange={handleChange} placeholder="tu@email.com" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha</label>
              <input type="date" name="fecha" value={form.fecha} onChange={handleChange} min={today} required />
            </div>
            <div className="form-group">
              <label>Número de personas</label>
              <select name="num_personas" value={form.num_personas} onChange={handleChange}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Hora de llegada</label>
              <select name="hora_inicio" value={form.hora_inicio} onChange={handleChange} required>
                <option value="">Seleccionar hora</option>
                {['13:00','13:30','14:00','14:30','15:00','15:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'].map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Duración</label>
              <select name="hora_fin" value={form.hora_fin} onChange={handleChange}>
                <option value="">2 horas (estándar)</option>
                <option value="1.5">1.5 horas</option>
                <option value="2">2 horas</option>
                <option value="2.5">2.5 horas</option>
                <option value="3">3 horas</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notas especiales (opcional)</label>
            <input type="text" name="notas" value={form.notas} onChange={handleChange} placeholder="Alergias, celebración, preferencias..." />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button type="submit" className="btn btn-gold btn-full" disabled={loading}>
            {loading ? 'Reservando...' : 'Confirmar Reservación'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>¿Prefieres WhatsApp?</p>
          <button className="btn btn-outline" onClick={openWhatsApp} style={{ width: '100%', borderColor: '#25D366', color: '#25D366' }}>
            Reservar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

