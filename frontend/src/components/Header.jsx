export default function Header({ cartCount, onCartClick, onLogout }) {
  return (
    <header className="app-header">
      <h1 className="app-brand">E-Commerce Platform</h1>
      <div className="header-actions">
        <button className="btn-cart" onClick={onCartClick}>
          Cart ({cartCount})
        </button>
        <button className="btn-logout" onClick={onLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
