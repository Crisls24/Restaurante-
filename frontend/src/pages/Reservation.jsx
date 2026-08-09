import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReservation } from '../services/api';
import { useAuth } from '../context/AuthContext';

const WHATSAPP_NUMBER = '527711509246';

export default function Reservation() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cliente_nombre: '',
    cliente_telefono: '',
    cliente_email: '',
    fecha: '',
    hora_inicio: '',
    num_personas: 2,
    notas: '',
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        cliente_nombre: f.cliente_nombre || user.nombre || '',
        cliente_email: f.cliente_email || user.email || '',
        cliente_telefono: f.cliente_telefono || user.telefono || '',
      }));
    }
  }, [user]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(null);
    setLoading(true);

    try {
      const [h, m] = form.hora_inicio.split(':').map(Number);
      let endH = h + 2;
      let endM = m;
      if (endH >= 24) { endH = 23; endM = 59; }
      const data = {
        ...form,
        num_personas: Number(form.num_personas),
        cliente_email: form.cliente_email?.trim() || undefined,
        notas: form.notas?.trim() || undefined,
        hora_fin: `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`,
      };
      const result = await createReservation(data);
      setSuccess({ ...result, cliente_telefono: form.cliente_telefono, cliente_nombre: form.cliente_nombre });
      setForm({
        cliente_nombre: '',
        cliente_telefono: '',
        cliente_email: '',
        fecha: '',
        hora_inicio: '',
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

  function sendConfirmationWhatsApp() {
    if (!success) return;
    const digits = (success.cliente_telefono || '').replace(/\D/g, '');
    const waNum =
      digits.length === 10 ? `52${digits}` : digits;
    const msg = `Xiú · Alta Cocina Mexicana\n\n✅ Confirmación de reservación\n\nFecha: ${success.fecha}\nHora: ${success.hora_inicio}\nMesa: ${success.mesa_asignada}\nPersonas: ${success.num_personas}\n\n¡Te esperamos!`;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  const today = new Date().toISOString().split('T')[0];

  if (success) {
    let fechaFmt = success.fecha;
    try {
      fechaFmt = new Date(`${success.fecha}T12:00:00`).toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch { /* mantiene el formato original */ }

    const rows = [
      ['A nombre de', success.cliente_nombre || '—'],
      ['Fecha', fechaFmt],
      ['Hora', success.hora_inicio],
      ['Mesa', success.ubicacion ? `Mesa ${success.mesa_asignada} · ${success.ubicacion}` : `Mesa ${success.mesa_asignada}`],
      ['Personas', success.num_personas],
    ];

    return (
      <div className="page-center">
        <div className="card form-card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '72px', height: '72px', margin: '0 auto 1.2rem', borderRadius: '50%',
            border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '1.9rem', color: 'var(--gold)' }}>✓</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.9rem', fontWeight: 300, marginBottom: '0.4rem' }}>
            Reservación Registrada
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.8rem', fontSize: '0.9rem' }}>
            Gracias por elegir Xiú. Este es tu comprobante.
          </p>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.4rem 1.6rem', marginBottom: '1.2rem', textAlign: 'left' }}>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.9rem', paddingBottom: '0.7rem', borderBottom: '1px solid var(--border)' }}>
              Comprobante de reservación
            </p>
            {rows.map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px dashed rgba(255,255,255,0.08)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500, textTransform: 'capitalize' }}>{value}</span>
              </div>
            ))}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
            Al llegar, presenta tu nombre y teléfono para confirmar tu mesa.
          </p>

          <button className="btn btn-outline" onClick={sendConfirmationWhatsApp} style={{ width: '100%', borderColor: '#25D366', color: '#25D366', marginBottom: '0.6rem' }}>
            Enviarme la confirmación por WhatsApp
          </button>
          {isAuthenticated && (
            <button className="btn btn-outline" onClick={() => navigate('/my-reservations')} style={{ width: '100%', marginBottom: '0.6rem' }}>
              Ver mis reservaciones
            </button>
          )}
          <button className="btn btn-gold btn-full" onClick={() => setSuccess(null)}>
            Hacer otra reservación
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
        <p className="subtitle">Elige tu fecha y hora. Tu reservación queda registrada al instante.</p>

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
                {[1,2,3,4,5,6,7,8].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                ))}
              </select>
            </div>
          </div>

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
