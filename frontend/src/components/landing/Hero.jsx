export default function Hero({ onStart }) {
  return (
    <section className="hero" id="top">
      <div className="section-inner hero-inner">
        <span className="hero-badge">New season, new arrivals</span>
        <h1>Shop everything in one place</h1>
        <p>
          Discover a wide range of products, from everyday essentials to unique finds,
          all delivered right to your door with fast shipping and easy returns.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn-light" onClick={onStart}>Start shopping</button>
          <a className="btn-ghost" href="#products">Browse products</a>
        </div>
      </div>
    </section>
  );
}
