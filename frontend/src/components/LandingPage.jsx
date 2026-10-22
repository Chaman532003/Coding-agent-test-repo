export default function LandingPage({ onLogin }) {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <span className="landing-brand">E-Commerce Platform</span>
        <button type="button" className="btn-primary landing-login" onClick={onLogin}>
          Log in
        </button>
      </header>
      <main className="landing-main">
        <h1>Shop everything in one place</h1>
        <p>
          Discover a wide range of products, from everyday essentials to
          unique finds, all delivered right to your door.
        </p>
      </main>
    </div>
  );
}
