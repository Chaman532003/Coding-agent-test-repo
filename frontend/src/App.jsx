import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import LandingPage from './components/LandingPage'

/**
 * Application root component. Shows the landing page by default and
 * renders the LoginForm after the user clicks the header Log in button.
 * @returns {JSX.Element}
 */
export default function App() {
  const [view, setView] = useState('landing')

  if (view === 'login') return <LoginForm />

  return <LandingPage onLogin={() => setView('login')} />
}
