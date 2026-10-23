import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts } from "../services/products.js";

export default function ProductsPage({ onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <main className="products-page"><p>Loading products</p></main>;
  }

  if (error) {
    return (
      <main className="products-page">
        <div role="alert" className="error-message">{error}</div>
      </main>
    );
  }

  return (
    <main className="products-page">
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
          />
        ))}
      </div>
    </main>
  );
}
