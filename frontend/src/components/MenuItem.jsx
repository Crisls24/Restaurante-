export default function MenuItem({ item }) {
  return (
    <div className="menu-item-row">
      <div className="menu-item-info">
        <h3 className="menu-item-name">{item.nombre}</h3>
        <p className="menu-item-desc">{item.descripcion}</p>
        {(item.alergenos?.length > 0 || item.tags?.length > 0) && (
          <div className="menu-item-tags">
            {item.alergenos?.map((a) => (
              <span key={a} className="tag tag-allergen">{a}</span>
            ))}
            {item.tags?.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
      </div>
      <span className="menu-item-price">${item.precio.toFixed(2)}</span>
    </div>
  );
}
