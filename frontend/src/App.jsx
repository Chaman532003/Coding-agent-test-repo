import React, { useState } from 'react'
import LoginForm from './components/LoginForm'
import Header from './components/Header'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import { getCart } from './services/cart'

export default function App() {
  const [email, setEmail] = useState(null)
  const [view, setView] = useState('products')
  const [cart, setCart] = useState({ items: [], count: 0, total: 0 })

  async function handleLoggedIn(e) {
    setEmail(e)
    try {
      const c = await getCart()
      setCart(c)
    } catch (err) {
      setCart({ items: [], count: 0, total: 0 })
    }
  }

  function handleAdd(updatedCart) {
    setCart(updatedCart)
  }

  if (!localStorage.getItem('token') || !email) {
    return <LoginForm onLoggedIn={handleLoggedIn} />
  }

  return (
    <div>
      <Header count={cart.count || 0} onCartClick={() => setView('cart')} />
      {view === 'products' && <ProductsPage onAdd={async (productId) => {
        // import service dynamically
        const { addToCart } = await import('./services/cart')
        const updated = await addToCart(productId, 1)
        handleAdd(updated)
      }} />}
      {view === 'cart' && <CartPage cart={cart} onCartChange={setCart} onBack={() => setView('products')} />}
    </div>
  )
}
