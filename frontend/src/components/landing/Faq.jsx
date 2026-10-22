import { useState } from "react";
import { FAQS } from "../../data/landing.js";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(-1);
  return (
    <section className="section section-alt" id="faq">
      <div className="section-inner faq-inner">
        <h2>Frequently asked questions</h2>
        {FAQS.map((f, i) => {
          const open = openIndex === i;
          return (
            <div key={f.q} className="faq-item">
              <h3>
                <button type="button" id={`faq-q-${i}`} aria-expanded={open} aria-controls={`faq-a-${i}`}
                  onClick={() => setOpenIndex(open ? -1 : i)}>
                  {f.q}
                </button>
              </h3>
              {open && <p id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>{f.a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
