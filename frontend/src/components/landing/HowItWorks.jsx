import { STEPS } from "../../data/landing.js";

export default function HowItWorks() {
  return (
    <section className="section">
      <div className="section-inner">
        <h2>How it works</h2>
        <ol className="grid-3 steps">
          {STEPS.map((s) => (
            <li key={s.title} className="card step-card">
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
