import { useState } from "react";
import Icon from "./Icons.jsx";
import { NAV_LINKS } from "../../data/landing.js";

export default function SiteHeader({ onLogin }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="site-brand" href="#top">
          <Icon name="bag" size={22} />
          <span>E-Commerce Platform</span>
        </a>
        <nav className="site-nav" aria-label="Main" data-open={open ? "true" : "false"}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </nav>
        <button type="button" className="btn-primary landing-login" onClick={onLogin}>
          Log in
        </button>
        <button type="button" className="menu-toggle" aria-label="Menu" aria-expanded={open}
          onClick={() => setOpen(!open)}>
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}
