import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendNotification } from '../services/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const [phone, setPhone] = useState('');
  const [notifResult, setNotifResult] = useState(null);
  const [notifError, setNotifError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend(channel) {
    if (!phone) {
      setNotifError('Ingresa un número de teléfono');
      return;
    }
    setNotifError('');
    setNotifResult(null);
    setLoading(true);

    try {
      const message = `Hola ${user.nombre}! Tu reservación en Xiú está confirmada. Te esperamos.`;
      const result = await sendNotification(channel, phone, message);
      setNotifResult(`Confirmación enviada por ${channel.toUpperCase()} (Provider: ${result.provider})`);
    } catch (err) {
      setNotifError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="card profile-card">
        <h2>Mi Perfil</h2>
        <div className="profile-data">
          <div className="profile-row"><strong>Nombre</strong><span>{user?.nombre} {user?.apellido}</span></div>
          <div className="profile-row"><strong>Email</strong><span>{user?.email}</span></div>
          <div className="profile-row"><strong>Rol</strong><span>{user?.rol}</span></div>
        </div>
        <button className="btn btn-secondary" onClick={logout}>Cerrar Sesión</button>
      </div>

      <div className="card profile-card">
        <h2>Confirmar Reservación</h2>
        <p className="subtitle">Envía la confirmación por WhatsApp o SMS</p>

        <div className="form-group">
          <label>Número de teléfono</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+52 771 234 5678" />
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={() => handleSend('whatsapp')} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar WhatsApp'}
          </button>
          <button className="btn btn-secondary" onClick={() => handleSend('sms')} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar SMS'}
          </button>
        </div>

        {notifResult && <div className="alert alert-success">{notifResult}</div>}
        {notifError && <div className="alert alert-error">{notifError}</div>}
      </div>
    </main>
  );
}
