export default function Header({ cartCount, onCartClick, onLogout, userEmail }) {
  return (
    <header className="app-header">
      <div>
        <h1 className="app-brand">E-Commerce Platform</h1>
        {userEmail && <h2>Welcome, {userEmail}</h2>}
      </div>
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
