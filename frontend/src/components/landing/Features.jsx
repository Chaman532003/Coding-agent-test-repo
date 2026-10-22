import Icon from "./Icons.jsx";
import { FEATURES } from "../../data/landing.js";

export default function Features() {
  return (
    <section className="section" id="features">
      <div className="section-inner">
        <h2>Why shoppers love us</h2>
        <div className="grid-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="card feature-card">
              <span className="icon-badge"><Icon name={f.icon} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
