import { FOOTER_COLUMNS } from "../../data/landing.js";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-inner footer-grid">
        {FOOTER_COLUMNS.map((c) => (
          <div key={c.title}>
            <h3 className="footer-title">{c.title}</h3>
            <ul>
              {c.links.map((l) => (
                <li key={l}><a href="#top">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="section-inner footer-note">
        © {new Date().getFullYear()} E-Commerce Platform. All rights reserved.
      </p>
    </footer>
  );
}
