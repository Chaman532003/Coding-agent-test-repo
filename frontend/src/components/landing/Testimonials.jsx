import { TESTIMONIALS } from "../../data/landing.js";

export default function Testimonials() {
  return (
    <section className="section section-alt">
      <div className="section-inner">
        <h2>Loved by thousands</h2>
        <div className="grid-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card quote-card">
              <blockquote>{t.quote}</blockquote>
              <figcaption><strong>{t.name}</strong>, {t.role}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
