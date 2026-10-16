import React from 'react'
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export default function CartLine({ item, onRemove }) {
  return (
    <li className="cart-line">
      <img className="cart-line__image" src={item.image_url || ''} alt={item.name} />
      <div className="cart-line__info">
        <p className="cart-line__name">{item.name}</p>
        <p className="cart-line__unit">{currency.format(item.price)} each</p>
      </div>
      <div className="stepper"><span>{item.quantity}</span></div>
      <p className="cart-line__total">{currency.format(item.line_total)}</p>
      <button className="btn btn--ghost cart-line__remove" onClick={() => onRemove(item.product_id)}>Remove</button>
    </li>
  )
}
