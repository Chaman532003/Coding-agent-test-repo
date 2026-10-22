import { STATS } from "../../data/landing.js";

export default function StatsStrip() {
  return (
    <section className="stats" aria-label="Store statistics">
      <dl className="section-inner stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="stat">
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
