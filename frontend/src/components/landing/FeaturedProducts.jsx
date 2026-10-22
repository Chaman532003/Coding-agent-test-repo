import { PRODUCTS, formatUsd } from "../../data/landing.js";

export default function FeaturedProducts({ onAdd }) {
  return (
    <section className="section section-alt" id="products">
      <div className="section-inner">
        <h2>Featured products</h2>
        <div className="grid-3">
          {PRODUCTS.map((p) => (
            <article key={p.id} className="card product-card">
              <div className={`product-art tone-${p.tone}`} aria-hidden="true">{p.name.charAt(0)}</div>
              <h3>{p.name}</h3>
              <p>{p.blurb}</p>
              <div className="product-row">
                <span className="price">{formatUsd(p.price)}</span>
                <button type="button" className="btn-primary" onClick={() => onAdd(p.id)}>
                  Add to cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
