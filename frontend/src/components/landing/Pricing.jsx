import { useState } from "react";
import Icon from "./Icons.jsx";
import { PLANS } from "../../data/landing.js";

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  return (
    <section className="section" id="pricing">
      <div className="section-inner">
        <h2>Simple pricing</h2>
        <div className="toggle" role="group" aria-label="Billing period">
          <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)}>Monthly</button>
          <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)}>Yearly</button>
        </div>
        <div className="grid-3">
          {PLANS.map((p) => (
            <article key={p.name} className={`card plan-card${p.featured ? " plan-featured" : ""}`}>
              <h3>{p.name}</h3>
              <p className="plan-price">
                <span className="price">${yearly ? p.yearly : p.monthly}</span>
                <span className="plan-period">{yearly ? "/year" : "/month"}</span>
              </p>
              <ul>
                {p.perks.map((perk) => (
                  <li key={perk}><Icon name="check" size={16} /> {perk}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
