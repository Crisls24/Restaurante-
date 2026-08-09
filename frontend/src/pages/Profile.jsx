import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  const [phone, setPhone] = useState('');
  const [notifError, setNotifError] = useState('');

  function handleWhatsApp() {
    if (!phone) {
      setNotifError('Ingresa un número de teléfono');
      return;
    }
    setNotifError('');
    const digits = phone.replace(/\D/g, '');
    const waNum = digits.length === 10 ? `52${digits}` : digits;
    const message = `Hola ${user?.nombre}! Tu reservación en Xiú está confirmada. Te esperamos.`;
    window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(message)}`, '_blank');
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
        <p className="subtitle">Genera el enlace de WhatsApp con el mensaje de confirmación para enviar al cliente</p>

        <div className="form-group">
          <label>Número de teléfono</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="771 234 5678" />
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={handleWhatsApp}>
            Abrir WhatsApp con la confirmación
          </button>
        </div>

        {notifError && <div className="alert alert-error">{notifError}</div>}
      </div>
    </main>
  );
}
