export default function CartLine({ item, onRemove }) {
  return (
    <div className="cart-line">
      <div className="cart-line-info">
        <h4>{item.name}</h4>
        <p>Quantity: {item.quantity}</p>
      </div>
      <div className="cart-line-total">
        <p>${item.line_total.toFixed(2)}</p>
      </div>
      <button
        className="btn-remove"
        onClick={() => onRemove(item.product_id)}
      >
        Remove
      </button>
    </div>
  );
}
