import CartLine from "../components/CartLine.jsx";

export default function CartPage({ cart, onRemove }) {
  if (!cart || cart.items.length === 0) {
    return (
      <main className="cart-page">
        <p>Your cart is empty</p>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-items">
        {cart.items.map((item) => (
          <CartLine
            key={item.product_id}
            item={item}
            onRemove={onRemove}
          />
        ))}
      </div>
      <div className="cart-total">
        <h3>Order total: ${cart.total.toFixed(2)}</h3>
      </div>
    </main>
  );
}
