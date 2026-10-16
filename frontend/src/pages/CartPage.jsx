import React from 'react'
import CartLine from '../components/CartLine'
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function CartPage({ cart = { items: [], count: 0, total: 0 }, onCartChange, onBack }) {
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <main className="container cart">
        <h1 className="page-title">Your cart</h1>
        <div className="cart__empty">
          <p>Your cart is empty</p>
          <button className="btn btn--ghost" onClick={onBack}>Back to products</button>
        </div>
      </main>
    )
  }

  return (
    <main className="container cart">
      <h1 className="page-title">Your cart</h1>
      <button className="btn btn--ghost" onClick={onBack}>Back to products</button>
      <ul className="cart__lines">
        {cart.items.map((it) => (
          <CartLine key={it.product_id} item={it} onRemove={async (pid) => {
            const { removeFromCart } = await import('../services/cart')
            const updated = await removeFromCart(pid)
            if (typeof onCartChange === 'function') onCartChange(updated)
          }} />
        ))}
      </ul>
      <aside className="cart__summary">
        <h2>Order summary</h2>
        <div><span>Items</span><strong>{cart.count}</strong></div>
        <div><span>Total</span><strong>{currency.format(cart.total)}</strong></div>
      </aside>
    </main>
  )
}
