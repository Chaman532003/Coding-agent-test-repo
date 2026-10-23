export default function ProductCard({ product, onAdd }) {
  return (
    <article className="product-card">
      <img src={product.image_url} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <p className="product-description">{product.description}</p>
      <button className="btn-add-cart" onClick={() => onAdd(product.id)}>
        Add to cart
      </button>
    </article>
  );
}
