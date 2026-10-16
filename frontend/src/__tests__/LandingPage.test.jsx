import React from 'react'
import { render, screen, within, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Import the modules the planned changes will add/modify.
// These imports are deliberate: if the implementation is not present yet the import error is the RED signal.
import App from '../App.jsx'
import LandingPage from '../components/LandingPage.jsx'

test('AC-1.1 LandingPage banner contains wordmark and has a Log in button', () => {
  const { getByRole } = render(<LandingPage />)

  const banner = getByRole('banner')
  expect(banner).toBeInTheDocument()
  expect(banner).toHaveTextContent(/E-Commerce Platform/i)

  const loginButton = getByRole('button', { name: /Log in/i })
  expect(loginButton).toBeInTheDocument()
})

test('AC-2.1 LandingPage main contains H1 "Shop everything in one place" and a descriptive paragraph', () => {
  const { getByRole } = render(<LandingPage />)

  const main = getByRole('main')
  expect(main).toBeInTheDocument()

  // Assert a level-1 heading with the exact phrase is present inside main
  const heading = within(main).getByRole('heading', {
    level: 1,
    name: /Shop everything in one place/i,
  })
  expect(heading).toBeInTheDocument()

  // Assert there is at least one non-empty <p> inside the main landmark
  const paragraphs = Array.from(main.querySelectorAll('p'))
  const nonEmpty = paragraphs.find((p) => p.textContent && p.textContent.trim().length > 0)
  expect(nonEmpty).toBeTruthy()
  expect(nonEmpty.textContent.trim().length).toBeGreaterThan(0)
})

test('AC-3.1 LandingPage calls provided onLogin once when header Log in button is clicked', () => {
  const onLogin = vi.fn()
  const { getByRole } = render(<LandingPage onLogin={onLogin} />)

  const loginButton = getByRole('button', { name: /Log in/i })
  fireEvent.click(loginButton)

  expect(onLogin).toHaveBeenCalledTimes(1)
})

test('AC-4.1 App initially shows landing heading and no Email input before any interaction', () => {
  render(<App />)

  // Expect the landing heading to be present
  const heading = screen.getByRole('heading', { name: /Shop everything in one place/i })
  expect(heading).toBeInTheDocument()

  // And no input labelled Email should be present yet
  expect(screen.queryByLabelText(/Email/i)).toBeNull()
})

test('AC-5.1 Clicking the header Log in in App shows the login inputs and hides the landing heading', () => {
  const { getByRole } = render(<App />)

  // Click the header's Log in button
  const headerLogin = getByRole('button', { name: /Log in/i })
  fireEvent.click(headerLogin)

  // After clicking, the Email and Password inputs should be present
  const email = screen.getByLabelText(/Email/i)
  const password = screen.getByLabelText(/Password/i)
  expect(email).toBeInTheDocument()
  expect(password).toBeInTheDocument()

  // And the landing heading should no longer be visible
  expect(
    screen.queryByRole('heading', { name: /Shop everything in one place/i })
  ).toBeNull()
})
