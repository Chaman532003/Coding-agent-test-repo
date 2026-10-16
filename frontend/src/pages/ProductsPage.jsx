import React, { useEffect, useState } from 'react'
import { listProducts } from '../services/products'
import { addToCart } from '../services/cart'
import ProductCard from '../components/ProductCard'

export default function ProductsPage({ onAdd }) {
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    let mounted = true
    setStatus('loading')
    listProducts()
      .then((p) => {
        if (!mounted) return
        setProducts(p)
        setStatus('ready')
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message)
        setStatus('error')
      })
    return () => {
      mounted = false
    }
  }, [])

  async function handleAdd(productId) {
    const cart = await addToCart(productId, 1)
    if (typeof onAdd === 'function') onAdd(cart)
  }

  if (status === 'loading') return <div className="status">Loading products...</div>
  if (status === 'error') return <div role="alert" className="alert alert--error">{error}</div>

  return (
    <main className="container item-grid">
      <h1 className="page-title">Products</h1>
      <ul className="item-grid__list">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} onAdd={handleAdd} />
          </li>
        ))}
      </ul>
    </main>
  )
}
