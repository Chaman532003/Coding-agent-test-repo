import React from 'react'

/**
 * LandingPage component - the public homepage for the store.
 *
 * Props:
 * - onLogin: optional callback invoked when the header's Log in button is clicked
 *
 * This component uses semantic landmarks: a <header> (banner) and a <main>.
 * It intentionally keeps behaviour simple: if onLogin is provided it will be
 * called once when the Log in button is clicked.
 *
 * @param {{onLogin?: function}} props
 * @returns {JSX.Element}
 */
export default function LandingPage({ onLogin } = {}) {
  function handleLogin() {
    if (typeof onLogin === 'function') onLogin()
  }

  return (
    <div>
      <header>
        <div className="header-inner">
          <span className="wordmark">E-Commerce Platform</span>
          <button className="btn-primary" onClick={handleLogin} type="button">
            Log in
          </button>
        </div>
      </header>

      <main>
        <section className="hero">
          <h1>Shop everything in one place</h1>
          <p>
            Find the best products from trusted sellers. Fast shipping, easy
            returns, and great prices — everything you need in one place.
          </p>
        </section>
      </main>
    </div>
  )
}
