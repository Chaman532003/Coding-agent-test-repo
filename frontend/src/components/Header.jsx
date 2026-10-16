import React from 'react'

export default function Header({ count = 0, onCartClick }) {
  return (
    <header className="shell__header">
      <div className="shell__bar container">
        <div className="shell__brand">E-Commerce Platform</div>
        <button className="btn btn--ghost" onClick={onCartClick} aria-label="Open cart">
          Cart <span className="pill">({count})</span>
        </button>
      </div>
    </header>
  )
}
