import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMenu, createMenuItem, updateMenuItem, deleteMenuItem } from '../services/api';

const CATEGORIES = ['Entrada', 'Platillo principal', 'Bebida', 'Postre'];

const EMPTY_FORM = { nombre: '', descripcion: '', precio: '', categoria: 'Entrada', disponible: true, imagen_url: '' };

export default function AdminMenu() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [modal, setModal]       = useState(null); // null | 'create' | 'edit'
  const [editing, setEditing]   = useState(null); // item being edited
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [filterCat, setFilterCat] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (user?.rol !== 'admin') { navigate('/'); return; }
    load();
  }, [isAuthenticated, user]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await getMenu();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setModal('create');
    setError('');
  }

  function openEdit(item) {
    setForm({
      nombre: item.nombre || '',
      descripcion: item.descripcion || '',
      precio: item.precio || '',
      categoria: item.categoria || 'Entrada',
      disponible: item.disponible !== false,
      imagen_url: item.imagen_url || '',
    });
    setEditing(item);
    setModal('edit');
    setError('');
  }

  function closeModal() { setModal(null); setEditing(null); setError(''); }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, precio: parseFloat(form.precio) };
      if (modal === 'create') {
        await createMenuItem(payload);
        showSuccess('Platillo creado correctamente');
      } else {
        await updateMenuItem(editing._id || editing.id, payload);
        showSuccess('Platillo actualizado correctamente');
      }
      closeModal();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`¿Eliminar "${item.nombre}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(item._id || item.id);
    try {
      await deleteMenuItem(item._id || item.id);
      showSuccess(`"${item.nombre}" eliminado`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  }

  function showSuccess(msg) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  }

  const displayed = filterCat === 'all' ? items : items.filter((i) => i.categoria === filterCat);

  const catCount = (cat) => items.filter((i) => i.categoria === cat).length;

  return (
    <main className="container" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="section-label">Administración</p>
          <h1 className="page-title">Gestión de Menú</h1>
          <div className="divider-left" />
        </div>
        <button className="btn btn-gold" onClick={openCreate} style={{ alignSelf: 'flex-end' }}>
          + Nuevo platillo
        </button>
      </div>

      {success && <div className="alert alert-success" style={{ marginBottom: '1.5rem' }}>{success}</div>}
      {error && !modal && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Stats */}
      <div className="admin-menu-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-num">{items.length}</span>
          <span className="admin-stat-label">Total platillos</span>
        </div>
        {CATEGORIES.map((cat) => (
          <div className="admin-stat-card" key={cat}>
            <span className="admin-stat-num">{catCount(cat)}</span>
            <span className="admin-stat-label">{cat === 'Platillo principal' ? 'Principales' : cat + 's'}</span>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="dashboard-filters" style={{ marginBottom: '1.5rem' }}>
        <button className={`filter-btn ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>Todos</button>
        {CATEGORIES.map((cat) => (
          <button key={cat} className={`filter-btn ${filterCat === cat ? 'active' : ''}`} onClick={() => setFilterCat(cat)}>
            {cat === 'Platillo principal' ? 'Principales' : cat + 's'}
          </button>
        ))}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="loading">Cargando platillos...</div>
      ) : (
        <div className="admin-menu-table-wrap">
          <table className="admin-menu-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Sin platillos en esta categoría</td></tr>
              ) : (
                displayed.map((item) => (
                  <tr key={item._id || item.id}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text)' }}>{item.nombre}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{item.descripcion?.slice(0, 55)}{item.descripcion?.length > 55 ? '…' : ''}</div>
                    </td>
                    <td><span className="menu-tag">{item.categoria}</span></td>
                    <td style={{ color: 'var(--gold)', fontWeight: 500 }}>MXN {Number(item.precio).toFixed(0)}</td>
                    <td>
                      <span className={`admin-status-badge ${item.disponible !== false ? 'available' : 'unavailable'}`}>
                        {item.disponible !== false ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-icon edit" onClick={() => openEdit(item)} title="Editar">✏️</button>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleDelete(item)}
                          disabled={deleting === (item._id || item.id)}
                          title="Eliminar"
                        >
                          {deleting === (item._id || item.id) ? '…' : '🗑️'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear/editar */}
      {modal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'create' ? 'Nuevo platillo' : 'Editar platillo'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del platillo *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Ej. Mole negro con pato"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Categoría *</label>
                  <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Descripción breve del platillo"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio (MXN) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>URL de imagen</label>
                  <input
                    type="url"
                    value={form.imagen_url}
                    onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <input
                  type="checkbox"
                  id="disponible"
                  checked={form.disponible}
                  onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                  style={{ width: 'auto', accentColor: 'var(--gold)' }}
                />
                <label htmlFor="disponible" style={{ margin: 0, cursor: 'pointer' }}>Disponible en el menú</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-gold" style={{ flex: 1 }} disabled={saving}>
                  {saving ? 'Guardando...' : modal === 'create' ? 'Crear platillo' : 'Guardar cambios'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal} style={{ flex: 1 }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
