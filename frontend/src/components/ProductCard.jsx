import React, { useState } from 'react'
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function ProductCard({ product, onAdd }) {
  const [adding, setAdding] = useState(false)
  async function handleAdd() {
    setAdding(true)
    try {
      await onAdd(product.id)
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="item-card">
      <div className="item-card__media">
        <img src={product.image_url} alt={product.name} />
      </div>
      <div className="item-card__body">
        <h3 className="item-card__name">{product.name}</h3>
        <p className="item-card__meta">{product.description}</p>
        <div className="item-card__footer">
          <span className="item-card__price">{currency.format(product.price)}</span>
          <button className="btn btn--primary btn--block" onClick={handleAdd} disabled={adding}>
            {adding ? 'Adding...' : 'Add to cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
